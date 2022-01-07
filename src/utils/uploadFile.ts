/* eslint-disable @typescript-eslint/no-empty-function */
import { api } from "../services/apiClient";
import { IShowToast } from "./iShowToast";

interface IUploadFileParams {
  url: string;
  file: File;
  nameFileRequest: string;
  descriptionToast: string;
  showToast: (infoToast: IShowToast) => void;
  updateData?: () => void;
}

function uploadFile({
  url,
  file,
  nameFileRequest,
  showToast,
  descriptionToast,
  updateData = () => {},
}: IUploadFileParams): void {
  const formData = new FormData();
  formData.append(nameFileRequest, file);
  console.log(`file: ${file}`);
  api
    .patch(url, formData)
    .then(() => {
      showToast({
        description: descriptionToast,
        status: "success",
      });

      updateData();
    })
    .catch(error => {
      showToast({
        description: error.response.data.message,
        status: "error",
      });
    });
}

export { uploadFile };
