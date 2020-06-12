<script>
  let document = `%bTerms of Use
This web page represents our Terms of Use and Sale ("Agreement") regarding our website, located at ${process.env.BASE_URL}, and the tools we provide you (the "Website" or the "Service"). It was last posted on 7 December 2019. The terms, "we" and "our" as used in this Agreement refer to SmartClips and SMARTPROGRAMS LLC.

We may amend this Agreement at any time by posting the amended terms on our Website. We may or may not post notices on the homepage of our Website when such changes occur.

We refer to this Agreement, our Privacy Policy accessible at ${process.env.BASE_URL}/legal/privacy, and any other terms, rules, or guidelines on our Website collectively as our "Legal Terms." You explicitly and implicitly agree to be bound by our Legal Terms each time you access our Website. If you do not wish to be so bound, please do not use or access our Website.

%bLimited License
SmartClips grants you a non-exclusive, non-transferable, revocable license to access and use our Website in order for you to gain access to viewing, creating clips, and related services through our Website, strictly in accordance with our Legal Terms.

%bCopyrights and Trademarks
Unless otherwise noted, all materials including without limitation, logos, brand names, images, designs, photographs, video clips and written and other materials that appear as part of our Website are copyrights, trademarks, service marks, trade dress and/or other intellectual property whether registered or unregistered ("Intellectual Property") owned, controlled or licensed by SmartClips. Our Website as a whole is protected by copyright and trade dress. Nothing on our Website should be construed as granting, by implication, estoppel or otherwise, any license or right to use any Intellectual Property displayed or used on our Website, without the prior written permission of the Intellectual Property owner. SmartClips aggressively enforces its intellectual property rights to the fullest extent of the law. The names and logos of SmartClips, may not be used in any way, including in advertising or publicity pertaining to distribution of materials on our Website, without prior, written permission from SmartClips. SmartClips prohibits use of any logo of SmartClips or any of its affiliates as part of a link to or from any Website unless SmartClips approves such link in advance and in writing. Fair use of SmartClips’s Intellectual Property requires proper acknowledgment. Other product and company names mentioned in our Website may be the Intellectual Property of their respective owners.

%bLinks to Third-Party Websites
Our Website may contain links to Websites owned or operated by parties other than SmartClips. Such links are provided for your reference only. SmartClips does not monitor or control outside Websites and is not responsible for their content. SmartClips’s inclusion of links to an outside Website does not imply any endorsement of the material on our Website or, unless expressly disclosed otherwise, any sponsorship, affiliation or association with its owner, operator or sponsor, nor does SmartClips’ inclusion of the links imply that SmartClips is authorized to use any trade name, trademark, logo, legal or official seal, or copyrighted symbol that may be reflected in the linked Website.


%bRefunds
We do not issue refunds under any circumstance. All purchases are final.

No Warranties; Exclusion of Liability; Indemnification

OUR WEBSITE IS OPERATED BY SMARTPROGRAMS LLC ON AN "AS IS," "AS AVAILABLE" BASIS, WITHOUT REPRESENTATIONS OR WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, SmartClips SPECIFICALLY DISCLAIMS ALL WARRANTIES AND CONDITIONS OF ANY KIND, INCLUDING ALL IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NONINFRINGEMENT FOR OUR WEBSITE AND ANY CONTRACTS AND SERVICES YOU PURCHASE THROUGH IT. SmartClips SHALL NOT HAVE ANY LIABILITY OR RESPONSIBILITY FOR ANY ERRORS OR OMISSIONS IN THE CONTENT OF OUR WEBSITE, FOR CONTRACTS OR SERVICES SOLD THROUGH OUR WEBSITE, FOR YOUR ACTION OR INACTION IN CONNECTION WITH OUR WEBSITE OR FOR ANY DAMAGE TO YOUR COMPUTER OR DATA OR ANY OTHER DAMAGE YOU MAY INCUR IN CONNECTION WITH OUR WEBSITE. YOUR USE OF OUR WEBSITE AND ANY CONTRACTS OR SERVICES ARE AT YOUR OWN RISK. IN NO EVENT SHALL EITHER SmartClips OR THEIR AGENTS BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OF OUR WEBSITE, CONTRACTS AND SERVICES PURCHASED THROUGH OUR WEBSITE, THE DELAY OR INABILITY TO USE OUR WEBSITE OR OTHERWISE ARISING IN CONNECTION WITH OUR WEBSITE, CONTRACTS OR RELATED SERVICES, WHETHER BASED ON CONTRACT, TORT, STRICT LIABILITY OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF ANY SUCH DAMAGES. IN NO EVENT SHALL SmartClips’ LIABILITY FOR ANY DAMAGE CLAIM EXCEED THE AMOUNT PAID BY YOU TO SmartClips FOR THE TRANSACTION GIVING RISE TO SUCH DAMAGE CLAIM.

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE EXCLUSION MAY NOT APPLY TO YOU.

WITHOUT LIMITING THE FOREGOING, SmartClips DO NOT REPRESENT OR WARRANT THAT THE INFORMATION ON THE WEBSITE IS ACCURATE, COMPLETE, RELIABLE, USEFUL, TIMELY OR CURRENT OR THAT OUR WEBSITE WILL OPERATE WITHOUT INTERRUPTION OR ERROR.
`;

  let parts = document.split("\n");
</script>

<svelte:head>
  <title>SmartClips | Terms of Service</title>

  <meta property="og:site_name" content="SmartClips" />
  <meta property="og:title" content="SmartClips | Terms of Service" />
</svelte:head>

<div class="text-white p-5 lg:p-20">
  {#each parts as part}
    {#if !part}
      <br />
    {:else if part.startsWith('%b')}
      <p class="font-bold">{part.replace('%b', '')}</p>
    {:else}
      <p>{part}</p>
    {/if}
  {/each}

</div>
