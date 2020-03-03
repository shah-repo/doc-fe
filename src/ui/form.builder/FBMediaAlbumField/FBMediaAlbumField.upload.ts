import axios from "axios";
import _ from "lodash";
import { action, observable, set } from "mobx";
import { apiClient, FBMediaPresignedUrlProps } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import { FBMediaAssetDataProps, FBMediaProps } from "../FBMediaAlbum/FBMediaAlbum.types";
import FBStore from "../stores/ui/FBStore";

export class FBMediaAlbumFieldUpload {
  @observable public collection: FBMediaProps[] = [];
  public filesUploaded: FBMediaProps[] = [];
  public url = FBEndpoint.PrivateUpload;
  public files: File[] | undefined;
  public file: File | undefined;
  public fieldName: string | undefined;

  @action public setFiles = (files: File[] | undefined) => {
    set(this, "files", files && Array.from(files));
    this.upload();
  };

  @action public setFieldName = (fieldName: string) => {
    set(this, "fieldName", fieldName);
  };

  @action public upload = () => {
    if (_.isUndefined(this.files) || _.size(this.files) === 0) {
      return;
    }

    this.file = this.files.pop();
    if (!this.file) {
      return;
    }

    this.presignedUrl();
  };

  @action public presignedUrl = () => {
    const { promise } = apiClient().get(FBEndpoint.PrivateUpload, { filename: this.file!.name });
    promise
      .then((data: FBMediaPresignedUrlProps) => {
        const presignedUrl = _.get(data, "url");
        if (_.isUndefined(presignedUrl)) {
          return;
        }
        this.uploadS3(presignedUrl, this.file!);
      })
      .catch((_error) => {
        alert(_error);
      });
  };

  @action public uploadS3 = (url: string, file: File) => {
    const config = {
      headers: {
        "Content-Type": file.type,
      },
    };

    axios.put(url, file, config)
      .then(() => {
        this.createCandidate(url, file);
      })
      .catch((error) => {
        // handle error
        alert(error);
      })
      .then(() => {
        this.upload();
      });
  };

  @action public createCandidate = (url: string, file: File) => {
    if (_.isEmpty(FBStore.documentId)) {
      return;
    }

    const { promise } = apiClient().post(FBEndpoint.FileUploadCandidates, {
      ..._.pick(file, ["name", "type"]),
      preSignedUrl: url,
      fieldNameFromSchema: this.fieldName,
      document: {
        id: FBStore.documentId,
      },
    });

    promise
      .catch((_error) => {
        alert(_error);
      });
  };

  @action public downloadCandidates = () => {
    if (_.isEmpty(FBStore.documentId)) {
      return;
    }

    const { promise } = apiClient().get(FBEndpoint.FileUploadCandidates, {
      documentId: FBStore.documentId,
      status: "AVAILABLE",
    });

    promise
      .then((data: FBMediaProps[]) => {
        this.filesUploaded = _.filter(data, {fieldNameFromSchema: this.fieldName});
        this.download();
      })
      .catch((_error) => {
        alert(_error);
      });
  };

  @action public download = () => {
    if (_.isUndefined(this.filesUploaded) || _.size(this.filesUploaded) === 0) {
      return;
    }

    const img = this.filesUploaded.pop();
    if (!img) {
      return;
    }

    this.downloadImage(img);
  };

  @action public downloadImage = (img: FBMediaProps) => {
    const { promise } = apiClient().get(FBEndpoint.AssetUrl, {
      s3link: img.s3link,
      expireAt: "2020-03-03T23:59:00Z",
    });
    promise
      .then((data: FBMediaAssetDataProps) => {
        set(this, "collection", _.union(this.collection, [{
          ...img,
          s3link: data.url,
        }]));
        this.download();
      })
      .catch((_error) => {
        alert(_error);
      });
  };
}

export default FBMediaAlbumFieldUpload;
