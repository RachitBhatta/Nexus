import {
  Html,
  Body,
  Head,
  Preview,
  Tailwind,
  Container,
  Section,
  Img,
  Heading,
  Text,
  Link,
} from "@react-email/components";

interface VerifyEmailProps {
  otp: string;
  username: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ;
export default function VerifyEmail({ otp, username }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Nexus account</Preview>

      <Body className="font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Tailwind>
          <Container className="bg-white max-w-[480px] rounded-xl shadow-md px-6 py-8">

            {/* Logo */}
            <Section className="flex justify-center mb-6 ">
              <Img
                src="https://i.imgur.com/fbQdA6z.png"
                width="250"
                height="125"
                className="rounded-xl"
                alt="Nexus Logo"
              />
            </Section>

            {/* Greeting */}
            <Text className="text-xl text-gray-800 mb-3">
              Hi {username},
            </Text>

            {/* Heading */}
            <Heading className="text-[22px] font-semibold text-gray-900 mb-4">
              Verify your email address
            </Heading>

            {/* Body Text */}
            <Text className="text-gray-600 leading-relaxed mb-6">
              Thanks for creating a Nexus account. To confirm your identity,
              please enter the verification code below.  
              If you didn’t request this, you can safely ignore this email.
            </Text>

            {/* OTP Box */}
            <Section className="bg-gray-50 border border-gray-200 rounded-lg py-5 text-center mb-4">
              <Text className="text-sm text-gray-700 mb-1">
                Your Verification Code
              </Text>
              <Text className="text-3xl font-bold tracking-widest text-gray-900">
                {otp}
              </Text>
              <Text className="text-xs text-rose-500 mt-2">
                Valid for 10 minutes
              </Text>
            </Section>

            {/* Footer */}
            <Text className="text-xs text-gray-500 leading-relaxed mt-8">
              This message was produced by the Nexus Team in Nepal.  
              All rights reserved. View our{" "}
              <Link
                href={BASE_URL}
                target="_blank"
                className="text-blue-600 underline"
              >
                Privacy Policy
              </Link>
              .
            </Text>

          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
