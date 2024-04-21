const updateProgressBar = (e) => {
  const progress = e.progress;
  const barWidth = Math.floor(progress * 100);
  const barStyle = `${barWidth}%`;

  document.querySelector(".progress-bar").style.width = barStyle;
  document
    .querySelector(".progress-bar")
    .setAttribute("aria-valuenow", barWidth);
};

const addFile = async (e) => {
  e.preventDefault();

  const file = e.target[0].files[0];

  // Step - 1 Get a link from express so we can upload file to S3
  const data = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  };

  const postUrl = `http://localhost:5623/get-put-url`;

  const postResp = await axios.post(postUrl, data);

  const postData = postResp.data;

  if (!postData.preSignedUrl) {
    swal({
      title: "Express rejected the link",
      icon: "error",
    });

    return;
  }

  document.getElementById("progress-wrapper").style.display = "block";

  let awsResp;

  try {
    const config = {};

    // content type must match what express told to s3
    config.headers = {
      "content-type": postData.mimeType,
    };

    config.onUploadProgress = (e) => updateProgressBar(e);

    // AWS is expecing a put http verb

    awsResp = await axios.put(postData.preSignedUrl, file, config);

    console.log(awsResp);
  } catch (err) {
    console.log(err);
  }

  if (awsResp.status !== 200) {
    // Let server know it failed for some non aws reason
  }

  // AWS did not error, so let our server know what happened
  const finalUrlToServer = `http://localhost:5623/finalize-upload`;

  const finalData = {
    key: postData.uniqueKeyName,
  };

  const serverResp = await axios.post(finalUrlToServer, finalData);

  const imageUrl = serverResp.data.signedUrl;

  document.getElementById("current-image").innerHTML =
    `<img src="${imageUrl}" width="100%" />`;
};

document.getElementById("file-form").addEventListener("submit", addFile);
