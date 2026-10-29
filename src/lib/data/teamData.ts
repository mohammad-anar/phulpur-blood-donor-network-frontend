/**
 * ফুলপুর ব্লাড ডোনার নেটওয়ার্ক
 * ওয়েবসাইট টিম ও পরিচালনাকারী কনফিগারেশন ডেটা
 *
 * ছবি, নাম, পদবি, ফোন নম্বর ও ইমেইল এখান থেকে সহজে পরিবর্তন করা যাবে।
 */

export interface TeamMember {
  id: "owner" | "developer";
  badge: string;
  roleType: "owner" | "developer";
  name: string;
  designation: string;
  phone: string;
  phoneCallUrl: string;
  email: string;
  emailSendUrl: string;
  facebookUrl: string;
  facebookText?: string;
  image: string;
}

// শেয়ার করা প্রোফাইল ছবির পাথ (উভয় কার্ডেই এই ছবি ব্যবহৃত হচ্ছে)
export const SHARED_PROFILE_IMAGE = "/images/team-profile.jpg";
export const SHARED_PROFILE_IMAGE1 = "/images/team-profile1.jpeg";

export const teamMembers: TeamMember[] = [
  {
    id: "owner",
    badge: "ওয়েবসাইটের মালিক",
    roleType: "owner",
    name: "Md. Hridoy Hassan",
    designation: "ওয়েবসাইটের মালিক",
    phone: "01972-606255",
    phoneCallUrl: "tel:01972606255",
    email: "bonnochobi@gmail.com",
    emailSendUrl: "mailto:bonnochobi@gmail.com",
    facebookUrl: "https://www.facebook.com/hridoymia70601",
    facebookText: "facebook.com/hridoymia70601",
    image: SHARED_PROFILE_IMAGE1,
  },
  {
    id: "developer",
    badge: "ওয়েবসাইট ডেভেলপার",
    roleType: "developer",
    name: "MD. Anarul Islam",
    designation: "ফুলস্ট্যাক ডেভেলপার",
    phone: "01519601128",
    phoneCallUrl: "tel:01519601128",
    email: "01519601128",
    emailSendUrl: "mailto:01519601128",
    facebookUrl: "https://www.facebook.com/anarul.WEBANAR",
    facebookText: "facebook.com/anarul.WEBANAR",
    image: SHARED_PROFILE_IMAGE,
  },
];
