// gets [fistname] [lastname] from email
export function mailToName(mail: string) {
  return mail.split("@")[0].replace(".", " ");
}
