declare interface User {
  id: string;
  name: string;
  email: string;
  photo?: Image;
}

declare interface Image {
  id: string;
  name: string;
  url: string;
}
