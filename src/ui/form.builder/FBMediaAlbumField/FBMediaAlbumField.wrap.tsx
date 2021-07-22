/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { filter, get, isEmpty, join, map, union } from "lodash";
import { reaction, toJS } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FB, FBMediaAlbumFieldProps, FBMediaAlbumFieldState } from "..";
import { companySelectors } from "../../../state/ducks/company";
import { toastError } from "../../components/notifications";

export const withFBMediaAlbumField = <T extends FBMediaAlbumFieldProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    mediaAlbumFieldState,
    setMediaFieldMode,
    onFileUploadChange,
    isTemplate = false,
    actionsDisabled,
    reviseDisabled,
    loading,
    collection,
    removeMedia,
    editorConfig,
    index,
    name = "",
    qrValue = "",
    mode,
    type,
    fieldType,
    autosave = true,
    ...props
  }: T) => {

    const { workspaceState, formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) || editorConfig;
    const ids = map(formValue, "id");
    const redlineActive = useSelector(companySelectors.getRedlineActive);
    mediaAlbumFieldState = FB.useRef<FBMediaAlbumFieldState>(FBMediaAlbumFieldState, formValue);

    const {
      id: documentRevisionId,
      company: { companyMine: { id: companyId = undefined } = {} } = {},
    } = workspaceState || {};
    if (documentRevisionId && companyId) {
      qrValue = JSON.stringify({
        companyId,
        documentRevisionId,
        fieldName: name,
        fieldType: fieldType || type,
      });
    }

    // Handle mode
    setMediaFieldMode = () => {
      const mode = mediaAlbumFieldState?.mode === "qr" ? "media" : "qr";
      mediaAlbumFieldState?.setMode(mode);
    };

    useEffect(() => {
      if (!ids || isEmpty(ids)) { return; }
      mediaAlbumFieldState?.getFiles(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle image upload
    onFileUploadChange = (event: React.FormEvent<HTMLInputElement>) => {
      const eventFiles = get(event, "currentTarget.files", []);
      const invalidFiles: string[] = [];

      const validFiles: File[] = filter(eventFiles, (file) => {
        const fileName = get(file, "name", "");
        const type = fileName.split(".").pop();
        (type === "doc") && (invalidFiles.push(fileName));
        return type !== "doc";
      });

      if (!isEmpty(invalidFiles)) {
        toastError(`.doc files are not accepted. Please use .docx. Invalid documents: ${join(invalidFiles, ", ")}`);
      }

      mediaAlbumFieldState?.upload(validFiles);
    };

    useEffect(() => {
      reaction(
        () => workspaceState?.formInputSync?.get(name),
        (value) => {
          const syncIds = value;
          const syncValue = map(syncIds, (syncFile) => toJS(syncFile.id));
          const filesIds = map(mediaAlbumFieldState?.files, "id");
          const addedFiles: string[] = [];
          map(union(filesIds, syncValue), (fileId) => {
            mediaAlbumFieldState!.fromUpload = false;
            if (!syncValue.includes(fileId)) {
              mediaAlbumFieldState?.removeFile(fileId);
            } else {
              addedFiles.push(fileId);
            }
          });
          if (addedFiles.length === 0) { return; }
          mediaAlbumFieldState?.getFiles(addedFiles);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => reaction(
      () => mediaAlbumFieldState?.attachmentApi.data,
      (data) => {
        if (!data) { return; }
        mediaAlbumFieldState?.downloadUploadedList();
        mediaAlbumFieldState!.fromUpload = true;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);


    React.useEffect(() => {
      reaction(
        () => mediaAlbumFieldState?.files,
        (files) => {
          if (isTemplate) {
            const schemeItem = workspaceState?.getSchemaItemAt(index);
            if (schemeItem && workspaceState) {
              workspaceState.schema![index!] = {
                ...schemeItem,
                editorConfig: files,
              };
            }
          }
          formState?.setFieldValue(name, files, true, isTemplate);
          if (mediaAlbumFieldState?.fromUpload) {
            mediaAlbumFieldState!.fromUpload = false;
            if (mediaAlbumFieldState?.finishedUpload) {
              workspaceState?.saveDocRev(formState?.getValues());
              mediaAlbumFieldState!.finishedUpload = false;
            }
          }
          else {
            workspaceState?.saveDocRev(formState?.getValues());
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function isPreview(): boolean {
      if (isTemplate) {
        return workspaceState?.mode !== "design";
      }
      return workspaceState?.mode === "preview" && workspaceState?.isOutput;
    }
    useObserver(() => {
      mode = mediaAlbumFieldState?.mode;
      loading = mediaAlbumFieldState?.loading;
      collection = mediaAlbumFieldState?.collection;
    });

    if (isPreview() || !isEmpty(collection) || !isEmpty(ids)) {
      mediaAlbumFieldState?.setMode("media");
    }
    actionsDisabled = ((reviseDisabled && workspaceState?.isRevised) || isPreview()) && !redlineActive;

    return Component({
      ...(props as T),
      removeMedia: mediaAlbumFieldState?.removeFile,
      actionsDisabled,
      mediaAlbumFieldState,
      onFileUploadChange,
      setMediaFieldMode,
      reviseDisabled,
      editorConfig,
      index,
      collection,
      isTemplate,
      qrValue,
      loading,
      mode,
      name,
      autosave,
    });
  };

  return (props: T) => Comp(props);
};
