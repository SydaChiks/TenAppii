export const user = {
  id: "1",
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  profileImage: "https://i.pravatar.cc/300",
  unit: "301",
  rentAmount: 1200,
  dueDate: "2024-03-01",
  tenancyMonths: 12,
};

export const activities = [
  {
    id: "1",
    type: "Maintenance Request",
    description: "Air conditioning repair",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    type: "Maintenance Request",
    description: "Plumbing issue in bathroom",
    timeAgo: "2 hours ago",
  },
  {
    id: "3",
    type: "Maintenance Request",
    description: "Light fixture replacement",
    timeAgo: "2 hours ago",
  },
  {
    id: "4",
    type: "Payment",
    description: "February rent payment",
    timeAgo: "1 day ago",
  },
];

export const messages = [
  {
    id: "1",
    sender: "Maintenance",
    messages: [
      {
        id: "1",
        text: "The air conditioning unit needs maintenance. When can someone come to check it?",
        time: "10:32 AM",
        isSent: true,
      },
      {
        id: "2",
        text: "Of course! How can I assist you with your Sandton City Towers apartment?",
        time: "10:31 AM",
        isSent: false,
      },
      {
        id: "3",
        text: "Hi, I have a question about my apartment in Sandton City Towers.",
        time: "10:30 AM",
        isSent: true,
      },
    ],
  },
  {
    id: "2",
    sender: "Property Manager",
    messages: [
      {
        id: "1",
        text: "Your request for maintenance has been approved.",
        time: "09:15 AM",
        isSent: false,
      },
      {
        id: "2",
        text: "Thank you for the prompt response.",
        time: "09:10 AM",
        isSent: true,
      },
    ],
  },
];

export const news = [
  {
    id: "1",
    title: "Sandton City Mall Updates",
    content:
      "New stores opening this month in Sandton City, including international fashion brands and local boutiques...",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    likes: 42,
    comments: 15,
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    title: "Nelson Mandela Square Events",
    content:
      "Upcoming cultural celebrations and art exhibitions at Nelson Mandela Square this weekend...",
    image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743",
    likes: 38,
    comments: 12,
    timeAgo: "1 day ago",
  },
];

export const payments = [
  { id: "1", amount: 440450.0, date: "2024-03-01", status: "upcoming" },
  { id: "2", amount: 440450.0, date: "2024-02-01", status: "paid" },
  { id: "3", amount: 440450.0, date: "2024-01-01", status: "paid" },
];

export const paymentMethods = [
  { id: "1", cardNumber: "••••4242", expiryDate: "12/25", type: "visa" },
];
