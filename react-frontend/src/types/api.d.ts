declare interface User {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  photo?: Image;
}

declare interface Image {
  id: string;
  name: string;
  url: string;
}
