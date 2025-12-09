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

interface TwoFAEmailProps {
  username: string;
  twoFACode: string;
  device: string;
  location: string;
  expiresInMinutes: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function TwoFAEmail({
  username,
  twoFACode,
  device,
  location,
  expiresInMinutes,
}: TwoFAEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Nexus 2FA code</Preview>

      <Body  className="font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Tailwind>
          <Container className="bg-white w-full max-w-[480px] rounded-xl shadow-lg p-6 mx-auto">

            {/* Logo */}
            <Section className="text-center mb-4">
              <Img
                src="https://i.imgur.com/fbQdA6z.png"
                width="200"
                height="110"
                alt="Nexus Logo"
                className="mx-auto rounded-lg"
              />
            </Section>

            {/* Greeting & Message */}
            <Section>
              <Text className="text-xl font-semibold text-gray-800 mb-4 ">
                Hi {username},
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-6 text-center">
                We received a request to sign in to your Nexus account. Use the code below to complete login.
              </Text>

              {/* 2FA Code */}
              <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
                {twoFACode}
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-6">
                This code expires in {expiresInMinutes} minutes.
              </Text>

              {/* Device & Location */}
              <Text className="text-sm text-gray-600 text-center mb-6">
                Requested from {device}, {location}.
              </Text>

              {/* Security Note */}
              <Text className="text-sm text-gray-600 text-center mb-6">
                Do not share this code with anyone. If you did not request this, please reset your password immediately.
              </Text>

              {/* Reset Password Button */}
              <Section className="text-center mb-4">
                <Button
                  href={`${BASE_URL}/reset-password`}
                  className="bg-green-500 text-white py-3 px-6 rounded-lg inline-block font-semibold"
                >
                  Reset Password
                </Button>
              </Section>

              <Hr className="bg-gray-300 my-6" />

              {/* Footer */}
              <Text className="text-sm text-gray-600 text-center">
                #1100 Thamel Avenue STE Bay Area, Kathmandu, Nepal
              </Text>
            </Section>

          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}

