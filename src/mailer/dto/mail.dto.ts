export interface MailDto {
  recipients: {
    name: string;
    address: string;
  }[];
  subject: string;
  html: string;
}
