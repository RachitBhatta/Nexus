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

interface RecoveryEmailProps {
  username: string;
  recoveryCode: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn('NEXT_PUBLIC_BASE_URL is not defined, using fallback for account recovery email');
}
export default function AccountRecovery({
  username,
  recoveryCode,
}: RecoveryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Recover your Nexus account</Preview>

      <Body  className="font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Tailwind>
          <Container className="bg-white w-full max-w-[480px] rounded-xl shadow-lg p-6 mx-auto">

            <Section className="text-center mb-6">
              <Img
                src="https://i.imgur.com/fbQdA6z.png"
                width="200"
                height="90"
                className="rounded-lg mx-auto"
                alt="Nexus Logo"
              />
            </Section>

            <Section>
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Account Recovery
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4">
                Hi {username}, 
              </Text>
              <Text className="my-4 text-base text-gray-700 leading-6 mb-4">
                Use the recovery code below to regain access to your Nexus account.
              </Text>

              <Text className="text-xl font-bold text-gray-900 tracking-wider mb-6 text-center">
                {recoveryCode}
              </Text>

              <Section className="text-center mb-4">
                <Button
                  href={`${BASE_URL}/recover`}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg inline-block font-semibold"
                >
                  Continue Recovery
                </Button>
              </Section>

              <Hr className="bg-gray-300 my-6" />
              <Text className="text-sm text-gray-600">
                If you didn’t request this, your account may be compromised.
              </Text>

            </Section>

          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
