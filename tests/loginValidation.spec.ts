// Aim: verify the login forms surface field validation feedback correctly.
// Rules:
// - The submit button stays disabled until the required fields are valid.
// - A field's helper/error line appears beneath it on blur with the message.

import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { nextTick } from "vue";
import LoginPage from "~/pages/login.vue";

describe("Sign in form validation feedback", () => {
  it("keeps the submit button disabled until the required fields are valid", async () => {
    const loginViewEl = await mountSuspended(LoginPage);

    // The page opens in sign-up mode, so switch to the sign-in form first.
    await loginViewEl.find(".login-card__switch-button").trigger("click");
    await nextTick();

    const submit = loginViewEl.find(".login-form__submit");
    expect(submit.attributes("disabled")).toBeDefined();

    // Sign-in mode requires a valid email and password.
    await loginViewEl.find("#login-email").setValue("user@example.com");
    await loginViewEl.find("#login-password").setValue("secret1");
    await nextTick();

    expect(submit.attributes("disabled")).toBeUndefined();
  });

  it("shows the invalid-email message beneath the email field on blur if the email doesn't match the regex expression", async () => {
    const loginViewEl = await mountSuspended(LoginPage);

    // The page opens in sign-up mode, so switch to the sign-in form first.
    await loginViewEl.find(".login-card__switch-button").trigger("click");
    await nextTick();

    const email = loginViewEl.find("#login-email");
    await email.setValue("not-an-email");
    await email.trigger("blur");
    await nextTick();

    const helper = loginViewEl.find("#login-email-helper");
    expect(helper.exists()).toBe(true);
    expect(helper.text()).toContain("Por favor escribe un correo válido");
  });

  it("clears the invalid-email message on input once the value becomes valid", async () => {
    const loginViewEl = await mountSuspended(LoginPage);

    // The page opens in sign-up mode, so switch to the sign-in form first.
    await loginViewEl.find(".login-card__switch-button").trigger("click");
    await nextTick();

    const email = loginViewEl.find("#login-email");
    // Make the field invalid and surface the error on blur.
    await email.setValue("not-an-email");
    await email.trigger("blur");
    await nextTick();
    expect(loginViewEl.find("#login-email-helper").exists()).toBe(true);

    // Typing a valid value fires the input event, which should clear the message.
    await email.setValue("user@example.com");
    await nextTick();

    expect(loginViewEl.find("#login-email-helper").exists()).toBe(false);
  });

  it("shows the invalid-password message beneath the password field on blur if the password doesn't match the regex expression", async () => {
    const loginViewEl = await mountSuspended(LoginPage);

    // The page opens in sign-up mode, where the password complexity rule applies.
    const password = loginViewEl.find("#login-password");
    await password.setValue("invalid-password");
    await password.trigger("blur");
    await nextTick();

    const helper = loginViewEl.find("#login-password-helper");
    expect(helper.exists()).toBe(true);
    expect(helper.text()).toContain(
      "Escribe mínimo 8 caracteres incluyendo 1 mayúscula, 1 minúscula, 1 número y un caracter especial (!@#$%^&*)",
    );
  });

  it("removes the error class from the password helper once a value matching the regex is entered", async () => {
    const loginViewEl = await mountSuspended(LoginPage);

    // The page opens in sign-up mode, where the password complexity rule applies.
    const password = loginViewEl.find("#login-password");
    // Make the field invalid and surface the error on blur.
    await password.setValue("invalid-password");
    await password.trigger("blur");
    await nextTick();

    const helper = loginViewEl.find("#login-password-helper");
    expect(helper.classes()).toContain("login-field__helper--error");

    // Typing a value that matches the pattern fires the input event, which
    // should mark the field valid again and drop the error class.
    await password.setValue("Valid1@pass");
    await nextTick();

    expect(helper.classes()).not.toContain("login-field__helper--error");
  });

  it("shows the name helper text beneath the name field on blur if the name doesn't match the regex expression", async () => {
    const loginViewEl = await mountSuspended(LoginPage);

    // The page opens in sign-up mode, where the name field is required.
    const name = loginViewEl.find("#login-name");
    await name.setValue("name123");
    await name.trigger("blur");
    await nextTick();

    const helper = loginViewEl.find("#login-name-helper");
    expect(helper.exists()).toBe(true);
    expect(helper.text()).toContain("Introduce tu nombre");
  });
});
