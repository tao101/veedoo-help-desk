import { eq, or } from "drizzle-orm";
import { db } from "..";
import { User, UserInsert, users } from "../schema/users";

export async function addOrUpdateContact(
  id: string,
  workEMail: string,
  name: string,
  firstName: string,
  lastName: string
) {
  let contact = await db.query.users.findFirst({
    where: or(eq(users.id, id), eq(users.email, workEMail)),
  });

  if (!contact) {
    contact = await addContact(id, workEMail, name, firstName, lastName);
  } else {
    contact = await updateContact(id, workEMail, name, firstName, lastName);
  }

  return contact;
}

export async function addContact(
  id: string,
  workEMail: string,
  name: string,
  firstName: string,
  lastName: string
) {
  let newUser: UserInsert = {
    id: id,
    email: workEMail,
    name: name,
    firstName: firstName,
    lastName: lastName,
  };

  let contacts = await db.insert(users).values(newUser).returning();
  return contacts?.length > 0 ? contacts[0] : undefined;
}

export async function updateContact(
  id: string,
  workEMail: string,
  name: string,
  firstName: string,
  lastName: string
) {
  let contacts = await db
    .update(users)
    .set({
      email: workEMail,
      name: name,
      firstName: firstName,
      lastName: lastName,
    })
    .where(eq(users.id, id))
    .returning();
  return contacts?.length > 0 ? contacts[0] : undefined;
}
