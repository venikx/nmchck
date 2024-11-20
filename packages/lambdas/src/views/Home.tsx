export function Home() {
  return (
    <html>
      <head>
        <title>Phone Reports</title>
      </head>
      <body>
        <h1>Welcome to Phone Yolo</h1>
        <p>Lookup phone numbers or report them for their behavior.</p>
        <form hx-post="/report" hx-swap="none">
          <label for="phone">Phone Number:</label>
          <input type="text" id="phone" name="phone" required />
          <label for="status">Status:</label>
          <select id="status" name="status">
            <option value="safe">Safe</option>
            <option value="scammer">Scammer</option>
          </select>
          <button type="submit">Submit Report</button>
        </form>
        <script src="https://unpkg.com/htmx.org"></script>
      </body>
    </html>
  );
}
