const execPostReq = async (url, param) => {
  return new Promise((resolve, reject) => {
    $.post(url, param, data => {
      if (data.status === 500){
        treatErrors(data.err)
        reject();
      } else
        resolve(data);
    });
  });
}

const execGettReq = async (url, param) => {
  return new Promise((resolve, reject) => {
    $.get(url, param, data => {
      if (data.status === 500){
        treatErrors(data.err)
        reject();
      } else
        resolve(data);
    });
  });
}

const treatErrors = (err) => {
  err.forEach(({ userMsg, devErr }) => {
    alert(userMsg);
    markFiledAsWrong('#' + devErr);
  });
}

const markFiledAsWrong = (fieldId) => {
  console.log(fieldId);
}