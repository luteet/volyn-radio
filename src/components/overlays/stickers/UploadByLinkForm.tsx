import { memo, useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import * as S from "./Stickers.styles";

interface Props {
  onSubmit: (form: HTMLFormElement) => void;
}

export const UploadByLinkForm = memo(({ onSubmit }: Props) => {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    await onSubmit(event.currentTarget);
    setIsSubmitting(false);
  };

  return (
    <S.UploadLink onSubmit={handleSubmit}>
      <Input
        onChange={(e) => setUrl(e.target.value)}
        name="link"
        placeholder="https://media.tenor.com/..."
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
      />
      <Button type="submit" disabled={isSubmitting || !url.trim()}>
        {isSubmitting ? "Uploading..." : "Upload"}
      </Button>
    </S.UploadLink>
  );
});
