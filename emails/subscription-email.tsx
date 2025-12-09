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

interface SubscriptionEmailProps {
  username: string;
  plan: string;
  price: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function SubscriptionUpgrade({
  username,
  plan,
  price,
}: SubscriptionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Nexus subscription is active</Preview>

      <Body  className="font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Tailwind>
          <Container className="bg-white w-full max-w-[480px] rounded-xl shadow-lg p-6 mx-auto">

            <Section className="text-center mb-6">
              <Img
                src="https://i.imgur.com/fbQdA6z.png"
                width="200"
                height="90"
                className="mx-auto rounded-lg"
                alt="Nexus Logo"
              />
            </Section>

            <Section>
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Subscription Updated
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-4">
                Hi {username}, your Nexus subscription has been successfully activated.
              </Text>

              <Text className="text-base text-gray-700 leading-6 mb-6">
                <strong>Plan:</strong> {plan}  
                <br />
                <strong>Price:</strong> {price} / month
              </Text>

              <Section className="text-center mb-4">
                <Button
                  href={`${BASE_URL}/dashboard`}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg inline-block font-semibold"
                >
                  Go to Dashboard
                </Button>
              </Section>

              <Hr className="bg-gray-300 my-6" />
              <Text className="text-sm text-gray-600">
                Thank you for choosing Nexus to power your projects.
              </Text>
            </Section>

          </Container>
        </Tailwind>
      </Body>
    </Html>
  );
}
