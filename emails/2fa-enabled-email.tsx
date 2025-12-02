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

interface TwoFAEnabledProps {
  username: string;
  device: string;
  location: string;
  time: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function TwoFAEnabled({
  username,
  device,
  location,
  time,
}: TwoFAEnabledProps) {
  return (
    <Html>
      <Head />
      <Preview>Two-Factor Authentication Enabled on your Nexus account</Preview>

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
                className="mx-auto rounded-lg"
              />
            </Section>

            {/* Greeting & Message */}
            <Section>
              <Text className="text-xl font-semibold text-gray-800 mb-4 ">
                Hi {username},
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4 text-center">
                Two-Factor Authentication (2FA) has been successfully enabled on your Nexus account.
              </Text>

              {/* Login Details */}
              <Text className="text-base text-gray-700 leading-6 mb-6 ">
                <strong>Device:</strong> {device}  
                <br />
                <strong>Location:</strong> {location}  
                <br />
                <strong>Time:</strong> {time}
              </Text>

              {/* Security Action */}
              <Text className="text-base text-gray-700 leading-6 mb-6 text-center">
                If you did not enable 2FA, please secure your account immediately.
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

