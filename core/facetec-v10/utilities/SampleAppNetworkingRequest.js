import { DeveloperStatusMessages } from "./DeveloperStatusMessages";

export class SampleAppNetworkingRequest {
  static MAX_ERRORS_ALLOWED = 2;

  static send(
    referencingProcessor,
    sessionRequestBlob,
    sessionRequestCallback
  ) {
    const appkey = window.localStorage.getItem("appkey");
    const userAgent = window.navigator.userAgent;

    const sessionRequestCallPayload = {
      requestBlob: sessionRequestBlob,
      appkey,
      userAgent,
    };

    const request = new XMLHttpRequest();
    request.timeout = 2 * 60 * 1000;

    const openAndSendRequest = () => {
      request.open(
        "POST",
        process.env.REACT_APP_BASE_URL + '/facecaptcha/service/captcha/3d/process-request'
      );
      request.setRequestHeader("Content-Type", "application/json");
      request.send(JSON.stringify(sessionRequestCallPayload));
    };

    let errorCount = 0;

    request.onload = (response) => {
      const responseJSON = JSON.parse(response.target.response);
      console.log(responseJSON);

      const responseBlob =
        SampleAppNetworkingRequest.getResponseBlobOrHandleError(request);

      if (responseBlob !== null) {
        DeveloperStatusMessages.validateLivenessResult(
          responseJSON,
          sessionRequestCallback
        );

        referencingProcessor.onResponseBlobReceived(
          responseBlob,
          sessionRequestCallback
        );
      } else {
        referencingProcessor.onCatastrophicNetworkError(
          sessionRequestCallback
        );
      }
    };

    request.onerror = (ev) => {
      if (errorCount < SampleAppNetworkingRequest.MAX_ERRORS_ALLOWED) {
        errorCount++;
        setTimeout(openAndSendRequest, errorCount * 1000);
        return;
      }

      DeveloperStatusMessages.logMessage(
        `SampleAppNetworkingRequest >> request.onerror >> Catastrophic error: ${ev}`
      );

      referencingProcessor.onCatastrophicNetworkError(
        sessionRequestCallback
      );
    };

    request.upload.onprogress = (ev) => {
      referencingProcessor.onUploadProgress(
        ev.loaded / ev.total,
        sessionRequestCallback
      );
    };

    openAndSendRequest();
  }

  static getResponseBlobOrHandleError(request) {
    if (request.status === 200) {
      try {
        const parsedResponse = JSON.parse(request.responseText);

        return parsedResponse.responseBlob;
      } catch (e) {
        DeveloperStatusMessages.logMessage(
          `Erro ao parsear response: ${e}`
        );
      }
    } else {
      DeveloperStatusMessages.logMessage(
        `Server Status: ${request.status}`
      );
    }

    return null;
  }
}