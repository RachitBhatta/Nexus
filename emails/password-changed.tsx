import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface PasswordChangedProps {
  username: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  console.warn("NEXT_PUBLIC_BASE_URL is not set. Using fallback URL.");
}
export default function PasswordChanged({ username }: PasswordChangedProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Nexus password was updated</Preview>
        <Body  className="font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Tailwind>
          <Container className="bg-white w-full max-w-[480px] rounded-xl shadow-lg p-6 mx-auto">

            {/* Logo */}
            <Section className="text-center mb-6">
              <Img
                src="https://i.imgur.com/fbQdA6z.png"
                width="200"
                height="90"
                alt="Nexus Logo"
                className="rounded-lg mx-auto"
              />
            </Section>

            {/* Content */}
            <Section>
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Password Updated
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4">
                Hi {username}, your Nexus password was successfully changed.
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-6">
                If you made this change, no action is needed.
                <br />
                If you <span className="font-semibold text-blue-600">
                did not</span> request this change, please secure your account immediately.
              </Text>

              {/* Secure Account Button */}
              <Section className="text-center mb-4">
                <Button
                  href={`${BASE_URL}/secure-account`}
                  className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg inline-block"
                >
                  Secure Account
                </Button>
              </Section>

              <Hr className="bg-gray-300 my-6" />

              <Text className="text-sm text-gray-600">
                To keep your account secure, please don't forward this email to anyone. 
              </Text>
            </Section>

          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
