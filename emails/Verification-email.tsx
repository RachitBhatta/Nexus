import {Container,Button,Text,Tailwind,Img,Link,Hr} from "@react-email/components"
interface verifyEmailProps{
    username:string,
    token:string
}
export default function verifyEmail({username,token}:verifyEmailProps){
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}verify/${token}`;
    return(
        <Tailwind>
            <Container className="max-x-xl max-auto bg-white border-rounded px-6 py-8">
                <Img
                alt="Nexus Logo"
                width={200}
                height={120}
                className="rounded-2xl mx-auto my-12"
                src="https://i.imgur.com/fbQdA6z.png"
                />
                <Text className="text-gray-800 text-base mb-2">Hi,{username},</Text>
                <Text className="text-semibold text-2xl leading-tight text-gray-900">Please,Verify Your Account</Text>
                <Text className="mb-4 text-semibold leading-relaxed text-gray-600">To activate your workspace,click the button below.<br/>This helps to keep your account secure</Text>
                <Button
                href={verificationUrl}
                className="bg-amber-500 hover:bg-amber-600 text-white  border-box w-full mx-auto font-semibold rounded-lg py-3 px-8 text center mt-5"
                ></Button>
                <Container className="bg-amber-50 border-l-4 border-amber-500 rounded-md p-4 mt-6 mb-6">
                    <Text className="text-amber-800 font-semibold text-sm text-center m-0">
                        ⏰ This link will expire in 10 minutes
                    </Text>
                </Container>
                <Hr className="border-gray-300 my-6" />
                <Text className="text-center mt-4 text-gray-600">If you didnt request this email,<br/>you can ignore this.</Text>
                <Text className="ml-1.5 text-gray-600">
                    Thank You,
                    <br/>
                    <span className="font-semibold">Nexus Team</span>
                    </Text>
                <Text className="text-gray-400 text-xs text-center mt-8">
                    For security reasons, never share this link with anyone.
                </Text>
            </Container>
        </Tailwind>
    )
}