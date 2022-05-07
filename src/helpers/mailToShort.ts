// gets [firstname].[lastname] from email
export default function mailToShort(mail: string) {
  return mail.split("@")[0];
}