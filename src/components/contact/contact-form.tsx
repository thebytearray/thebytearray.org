"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { CircleCheck, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { CopyEmailButton } from "@/components/contact/copy-email-button";
import { emailAddress, site } from "@/content/site";

const TOPICS = [
  { id: "support", label: "Help with an app" },
  { id: "collaboration", label: "Working together" },
  { id: "other", label: "Something else" },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];

// mailto: links get unreliable past a couple of thousand characters.
const MAX_MESSAGE_LENGTH = 1500;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Keep your name under 100 characters."),
  email: z.email("Enter an email address like name@example.com."),
  topic: z.enum(TOPICS.map((topic) => topic.id) as [TopicId, ...TopicId[]], {
    error: "Choose what your message is about.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters so we know how to help.")
    .max(MAX_MESSAGE_LENGTH, `Keep it under ${MAX_MESSAGE_LENGTH.toLocaleString("en-US")} characters, or email us directly.`),
});

type ContactValues = z.infer<typeof contactSchema>;

function buildMailto({ name, email, topic, message }: ContactValues) {
  const topicLabel = TOPICS.find((item) => item.id === topic)?.label ?? "Message";
  const subject = `${topicLabel}: message from ${name}`;
  const body = `${message}\n\n${name}\n${email}`;

  return `mailto:${emailAddress()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

export function ContactForm() {
  const [isSent, setIsSent] = useState(false);
  const { control, handleSubmit, reset } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onTouched",
  });

  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  const onValid = (values: ContactValues) => {
    window.location.assign(buildMailto(values));
    setIsSent(true);
  };

  const startOver = () => {
    reset();
    setIsSent(false);
  };

  return (
    <AnimatePresence initial={false} mode="wait">
      {isSent ? (
        <motion.div key="sent" {...fade} aria-live="polite" className="flex flex-col items-start gap-4" role="status">
          <CircleCheck aria-hidden="true" className="size-8 text-foreground" />
          <div>
            <h2 className="text-h3 font-bold">Your email app should now be open</h2>
            <p className="mt-2 text-muted">
              We’ve filled in your message. Press send in your email app to reach us. If nothing
              opened, email <span className="font-medium text-foreground">{site.emailDisplay}</span> directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyEmailButton />
            <Button size="sm" variant="ghost" onPress={startOver}>
              Write another message
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="form" {...fade}>
          <Form
            aria-label="Contact form"
            className="flex flex-col gap-5"
            validationBehavior="aria"
            onSubmit={handleSubmit(onValid)}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    isRequired
                    autoComplete="name"
                    isInvalid={fieldState.invalid}
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  >
                    <Label>Name</Label>
                    <Input ref={field.ref} placeholder="Your name" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    isRequired
                    autoComplete="email"
                    isInvalid={fieldState.invalid}
                    name={field.name}
                    type="email"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  >
                    <Label>Email</Label>
                    <Input ref={field.ref} placeholder="name@example.com" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />
            </div>

            <Controller
              control={control}
              name="topic"
              render={({ field, fieldState }) => (
                <Select
                  fullWidth
                  isRequired
                  isInvalid={fieldState.invalid}
                  name={field.name}
                  placeholder="Choose a topic"
                  value={field.value ?? null}
                  onBlur={field.onBlur}
                  onChange={(key) => field.onChange(key ?? undefined)}
                >
                  <Label>What is it about?</Label>
                  <Select.Trigger ref={field.ref}>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <FieldError>{fieldState.error?.message}</FieldError>
                  <Select.Popover>
                    <ListBox>
                      {TOPICS.map((topic) => (
                        <ListBox.Item key={topic.id} id={topic.id} textValue={topic.label}>
                          {topic.label}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              )}
            />

            <Controller
              control={control}
              name="message"
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  isRequired
                  isInvalid={fieldState.invalid}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                >
                  <Label>Message</Label>
                  <TextArea ref={field.ref} placeholder="How can we help?" rows={6} />
                  {fieldState.invalid ? (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  ) : (
                    <Description>
                      {messageLength.toLocaleString("en-US")} / {MAX_MESSAGE_LENGTH.toLocaleString("en-US")} characters
                    </Description>
                  )}
                </TextField>
              )}
            />

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">This opens your email app with the message ready to send.</p>
              <Button className="shrink-0" size="lg" type="submit">
                <Send aria-hidden="true" className="size-4" />
                Open email app
              </Button>
            </div>
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
