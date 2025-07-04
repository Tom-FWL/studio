
import { ContactForm } from "@/components/contact/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage({ searchParams }: { searchParams?: { project?: string } }) {
  const projectTitle = searchParams?.project;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline text-foreground mb-2">Get In Touch</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Have a project in mind or just want to say hello? I'd love to hear from you.
        </p>
      </header>

      {projectTitle && (
        <div className="text-center mb-8 bg-primary/10 p-4 rounded-md max-w-4xl mx-auto">
          <p className="text-primary">
            You're inquiring about the project: <span className="font-semibold">&quot;{projectTitle}&quot;</span>
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-headline mb-4">Send a Message</h2>
          <ContactForm projectTitle={projectTitle} />
        </div>
        <div className="space-y-8">
            <h2 className="text-2xl font-headline mb-4">Contact Information</h2>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent rounded-full">
                <Mail className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:hello@tommysdesk.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@tommysdesk.com
                </a>
              </div>
            </div>
            
            {/*
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent rounded-full">
                <Phone className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">(123) 456-7890</p>
              </div>
            </div>
            */}

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent rounded-full">
                <MapPin className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-muted-foreground">Kuala Lumpur, Malaysia</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
