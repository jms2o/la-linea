import bcrypt from "bcryptjs";
import type { Gender } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SessionPayload } from "@/lib/session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export type AuthenticateInput = {
  email: string;
  password: string;
};

export async function authenticate({
  email,
  password
}: AuthenticateInput): Promise<SessionPayload | null> {
  const admin = await prisma.user.findUnique({ where: { email } });

  if (admin && (await verifyPassword(password, admin.password))) {
    return {
      sub: admin.id,
      kind: "admin",
      role: admin.role,
      name: admin.name,
      email: admin.email
    };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });

  if (customer?.password && (await verifyPassword(password, customer.password))) {
    return {
      sub: customer.id,
      kind: "customer",
      name: customer.name,
      email: customer.email ?? email
    };
  }

  return null;
}

export type RegisterCustomerInput = {
  name: string;
  gender: Gender;
  email: string;
  phone: string;
  password: string;
};

export async function registerCustomer(
  input: RegisterCustomerInput
): Promise<SessionPayload | { error: string }> {
  const [existingAdmin, existingCustomer] = await Promise.all([
    prisma.user.findUnique({ where: { email: input.email } }),
    prisma.customer.findUnique({ where: { email: input.email } })
  ]);

  if (existingAdmin || existingCustomer) {
    return { error: "Ese correo ya esta registrado." };
  }

  const customer = await prisma.customer.create({
    data: {
      name: input.name,
      gender: input.gender,
      phone: input.phone,
      email: input.email,
      password: await hashPassword(input.password)
    }
  });

  return {
    sub: customer.id,
    kind: "customer",
    name: customer.name,
    email: customer.email ?? input.email
  };
}
