export default function mailToShort(mail: string) {
  return mail.split("@")[0];
}