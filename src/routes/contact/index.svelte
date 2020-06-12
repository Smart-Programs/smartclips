<form action="https://api.staticforms.xyz/submit" method="post">
  <input type="text" name="name" placeholder="Your Name" />
  <input type="text" name="email" placeholder="Your Email" />
  <textarea name="message" />
  <input type="text" name="honeypot" style="display:none" />
  <input
    type="hidden"
    name="accessKey"
    value="c8832755-13ee-43c5-a229-5fbeda7c8996" />
  <input type="hidden" name="subject" value="Contact us SmartClips" />
  <input type="hidden" name="replyTo" value="support@smartprograms.co" />
  <input
    type="hidden"
    name="redirectTo"
    value={`${process.env.BASE_URL}/contact/success`} />
  <input type="submit" value="Submit" />
</form>
