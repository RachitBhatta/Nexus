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

interface AccountDeletedProps {
  username: string;
  deletionTime: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AccountDeletedEmail({
  username,
  deletionTime,
}: AccountDeletedProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Nexus Account Has Been Deleted</Preview>

      <Body
        className="font-sans"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
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

            {/* Greeting & Main Message */}
            <Section>
              <Text className="text-2xl font-semibold text-gray-800 mb-4">
                Hi {username},
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4 text-center">
                We’re writing to confirm that your Nexus account has been
                <strong> permanently deleted</strong>.
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-6 text-center">
                <strong>Deletion Time:</strong> {deletionTime}
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4 text-center">
                If you did not request this deletion or believe this was done in error, you can attempt to restore your account within 7 days.
              </Text>

              {/* Restore Account Button */}
              <Section className="text-center mb-4">
                <Button
                  href={`${BASE_URL}/account-recovery`}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold inline-block"
                >
                  Restore Account
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
