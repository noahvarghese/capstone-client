// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import dotenv from "dotenv";

dotenv.config();

const { TIMEOUT_MULTIPLIER } = process.env;

const DEFAULT_MULTIPLIER = 1;

const multiplier = isNaN(Number(TIMEOUT_MULTIPLIER))
    ? Number(TIMEOUT_MULTIPLIER)
    : DEFAULT_MULTIPLIER;

jest.setTimeout(10000 * multiplier);
