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

interface WelcomeEmailProps {
  username: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Nexus — Build faster with us</Preview>

      <Body className="bg-gray-100 font-sans p-6">
        <Tailwind>
            <Container className="bg-white w-[480px] rounded-xl shadow-lg p-6 mx-auto w-full">

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
              Hi {username},
            </Text>

            <Text className="text-base text-gray-700 leading-6 mb-6">
              Welcome to <span className="font-semibold">Nexus</span>, the all-in-one platform
              designed to help you build, launch, and scale your projects faster
              and more efficiently.  
              You now have access to a unified environment where development,
              collaboration, and productivity come together.
            </Text>

            {/* Button */}
            <Section className="text-center">
                <Button
              href={BASE_URL}
              className="bg-green-500 text-white font-semibold py-3 px-5 rounded-lg text-center "
            >
              Get Started
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
