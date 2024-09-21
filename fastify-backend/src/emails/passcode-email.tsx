import "react";

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Row,
  Column,
  Heading,
} from "@react-email/components";
import TailwindConfig from "./tailwind-config";

export default function PasscodeEmail({ passcode }: { passcode: number }) {
  return (
    <Html>
      <Head />
      <Preview>Here is your passcode</Preview>
      <TailwindConfig>
        <Body className="bg-white font-sans mx-auto my-0">
          <Container className="mx-auto my-0 px-4">
            <Heading className="text-xl font-bold text-neutral-900 my-6 p-0 leading-tight">
              Confirm your email address
            </Heading>
            <Text className="text-lg mb-6 text-neutral-700">
              Your confirmation code is below - enter it in your open browser
              window and we'll help you get signed in.
            </Text>
            <Section className="bg-neutral-100 rounded-lg mb-6 px-10 py-3">
              <Text className="text-xl text-center align-middle">
                {passcode}
              </Text>
            </Section>
            <Text className="text-neutral-700">
              If you didn't request this code, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
