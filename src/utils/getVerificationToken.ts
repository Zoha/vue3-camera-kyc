export function getVerificationToken(): string {
  return (
    (
      document.querySelector(
        "[name=__RequestVerificationToken]"
      ) as HTMLInputElement
    )?.value ?? ""
  );
}
