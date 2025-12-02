import { Body, Container, Head, Html, Img, Preview, Section, Tailwind, Text,Button, Hr } from "@react-email/components"

interface PasswordResetEmailProps{
    username:string,
    resetPasswordLink:string
}

export default function PasswordResetEmail({username,resetPasswordLink}:PasswordResetEmailProps){
    return(
        <Html>
            <Head/>
            <Preview>Password-Reset-Email from Nexus.</Preview>
            <Body  className="font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <Tailwind>
                    <Container className="shadow-md mx-auto bg-white w-[480px] rounded-xl p-6 w-full">
                        <Section className="flex justify-center my-3 py-3 ">
                            <Img
                                src="https://i.imgur.com/fbQdA6z.png"
                                alt="Nexus Logo"
                                className="rounded-xl"
                                width="200"
                                height="110"
                            />
                        </Section>

                        <Section className="my-4" >
                            <Text className="font-semibold text-xl">
                                Hi {username},
                            </Text>
                            <Text className="my-4 text-base leading-xl">
                                Someone recently requested a password change for your Nexus
                                account. If this was you, you can set a new password here:
                            </Text>
                            <Section className="flex justify-center my-5">
                                <Button 
                                    className="text-center text-white bg-green-500 rounded-xl p-4"
                                    href={resetPasswordLink}
                                >
                                    Reset Password
                                </Button>
                            </Section>
                            <Text className="leading-xl text-base py-4 ">
                                If you don&apos;t want to change your password or didn&apos;t
                                request this, just ignore and delete this message.
                            </Text>
                            <Hr className="bg-gray-700 my-6"/>
                            <Text>
                                To keep your account secure, please don&apos;t forward this email to anyone.
                            </Text>
                        </Section>
                    </Container>
                </Tailwind>
            </Body>
        </Html>
    )
}
