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

interface SuspiciousLoginProps {
  username: string;
  location: string;
  device: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function SuspiciousLogin({
  username,
  location,
  device,
}: SuspiciousLoginProps) {
  return (
    <Html>
      <Head />
      <Preview>Suspicious login detected on your Nexus account</Preview>

      <Body  className="font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Tailwind>
          <Container className="bg-white w-full max-w-[480px] rounded-xl shadow-lg p-6 mx-auto">

            <Section className="text-center mb-6">
              <Img
                src="https://i.imgur.com/fbQdA6z.png"
                width="200"
                height="90"
                alt="Nexus Logo"
                className="mx-auto rounded-lg"
              />
            </Section>

            <Section>
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Suspicious Login Attempt
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4">
                Hi {username}, we detected a login attempt that doesn’t match your usual activity.
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4">
                <strong>Location:</strong> {location}  
                <br />
                <strong>Device:</strong> {device}
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-6">
                If this wasn’t you, click the button below to secure your account immediately.
              </Text>

              <Section className="text-center mb-4">
                <Button
                  href={`${BASE_URL}/secure-account`}
                  className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold inline-block"
                >
                  Secure Account
                </Button>
              </Section>

              <Hr className="bg-gray-300 my-6" />
              <Text className="text-sm text-gray-600">
                #1100 Thamel Avenue STE Bay Area, Kathmandu, Nepal
              </Text>
            </Section>

          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
