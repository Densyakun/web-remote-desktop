import React, { useState } from "react";
import useUser from "../lib/useUser";
import fetchJson, { FetchError } from "../lib/fetchJson";

export default function Form({ }) {
  const { mutateUser } = useUser();

  const [errorMsg, setErrorMsg] = useState("");

  return (
    <>
      <div className="login">
        <h4>Login</h4>

        <form onSubmit={async function handleSubmit(event) {
          event.preventDefault();

          const body = {
            password: event.currentTarget.password.value,
          };

          try {
            setErrorMsg("");
            mutateUser(
              await fetchJson("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              }),
              false,
            );
          } catch (error) {
            if (error instanceof FetchError) {
              setErrorMsg(error.data.message);
            } else {
              console.error("An unexpected error happened:", error);
            }
          }
        }}>
          <label>
            <span>Type your password</span>
            <input type="password" name="password" required />
          </label>

          <button type="submit">Login</button>

          {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        form,
        label {
          display: flex;
          flex-flow: column;
        }
        label > span {
          font-weight: 600;
        }
        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .error {
          color: brown;
          margin: 1rem 0 0;
        }
      `}</style>
    </>
  );
}
