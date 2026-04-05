import { Button } from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { useStickersContext } from "./stickersContextDef";
import { UploadByLinkForm } from "./UploadByLinkForm";
import * as S from "./Stickers.styles";

export function UploadSection() {
  const {
    draft,
    isDraggingFile,
    isUploading,
    uploadError,
    shouldShowBound,
    currentTrackTitle,
    bindUploadedToCurrentTrack,
    fileInputRef,
    onFiles,
    uploadFileByLink,
    setBindUploadedToCurrentTrack,
  } = useStickersContext();

  return (
    <>
      <S.UploadDropzone active={isDraggingFile}>
        <S.UploadTitle>
          {draft ? "Place the sticker on the page" : "Drop an image or choose a file"}
        </S.UploadTitle>
        <S.UploadHint>Only images are allowed.</S.UploadHint>

        <S.UploadControls>
          <Button
            type="button"
            disabled={isUploading || Boolean(draft)}
            onClick={() => fileInputRef.current?.click()}
          >
            Choose file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => onFiles(e.target.files)}
          />
        </S.UploadControls>

        {uploadError ? <S.UploadError>{uploadError}</S.UploadError> : null}
        {isUploading ? (
          <S.UploadLoading>
            <Spinner />
            <span>Uploading...</span>
          </S.UploadLoading>
        ) : null}
      </S.UploadDropzone>

      <S.UploadHr>OR</S.UploadHr>

      <UploadByLinkForm onSubmit={uploadFileByLink} />

      {currentTrackTitle ? (
        <S.BindCheckbox>
          <input
            type="checkbox"
            checked={bindUploadedToCurrentTrack}
            disabled={!shouldShowBound || isUploading || Boolean(draft)}
            onChange={(e) => setBindUploadedToCurrentTrack(e.target.checked)}
          />
          <span>
            <small>Show only while playing:</small> <br /> {currentTrackTitle}
          </span>
        </S.BindCheckbox>
      ) : null}
    </>
  );
}
