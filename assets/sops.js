/* The SLG Team — SOP Library data
 * One source of truth for every SOP shown on the site.
 * Shape:
 *   { slug, code, title, category, owner, frequency, purpose,
 *     steps: [{ title?, actions: [] }], tools: [], estimatedTime,
 *     definitionOfDone, qualityStandards, resources: [{label, url?}],
 *     createdBy, reviewedBy, lastUpdated, status }
 */
window.SLG_SOPS = [
  /* ───────────────────────── TEAM OPERATIONS — MJ ───────────────────────── */
  {
    slug: "email-management",
    code: "MJ-01",
    title: "Email Management",
    category: "Team Operations",
    owner: "MJ",
    frequency: "Daily",
    purpose:
      "Keep Seth's inbox clean and organized so he can focus on high-value work, never miss anything time-sensitive, and trust that nothing slips through.",
    steps: [
      {
        actions: [
          "Open Seth's inbox at the start of the workday.",
          "Triage every new message into the right folder: Urgent, Action Needed, Read Only, MLS Portals, or another set category.",
          "Flag time-sensitive items (closings, contract deadlines, showing requests, vendor confirmations) for immediate visibility.",
          "Reply directly to inbound leads using the standard response framework. Loop Seth in when a personal touch is needed.",
          "Draft replies for messages Seth needs to send himself, and leave them in Drafts for his review.",
          "Do a second sweep mid-afternoon to catch new arrivals and confirm nothing urgent is sitting unread.",
        ],
      },
    ],
    qualityStandards:
      "Inbox ends each day with zero un-triaged emails. Lead responses go out within two hours during business hours. Drafts match Seth's tone: direct, warm, professional.",
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "task-workflow-trello",
    code: "MJ-02",
    title: "Task & Workflow Management (Trello)",
    category: "Team Operations",
    owner: "MJ",
    frequency: "Daily",
    purpose:
      "Make sure every task Seth assigns moves forward, gets done, and is visibly tracked — so he never has to ask \"where are we on this?\"",
    steps: [
      {
        actions: [
          "Open Trello at the start of the workday and review the \"MJ To Do\" list.",
          "Identify new cards (anything added since the last review) and read the description and comments before acting.",
          "Prioritize by due date and label — tackle anything time-sensitive first.",
          "Move each card to \"Doing\" when work begins and to \"Done\" when complete.",
          "Comment on a card with a short status update if it's blocked, waiting on someone, or running long.",
          "Follow up on any open items from previous days that haven't moved.",
        ],
      },
    ],
    qualityStandards:
      "No card sits in \"Doing\" longer than 48 hours without a comment update. Every completed card has a note on the outcome or next step when relevant.",
    tools: [{ label: "Trello" }],
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "crm-follow-up-boss",
    code: "MJ-03",
    title: "CRM & Database Management (Follow Up Boss)",
    category: "Team Operations",
    owner: "MJ",
    frequency: "As needed / Ongoing",
    purpose:
      "Keep Follow Up Boss accurate and organized so the pipeline reflects reality and every contact is reachable, categorized, and actionable.",
    steps: [
      {
        actions: [
          "When Seth requests a new deal, create the deal record in FUB with all the details: contact, stage, property, deal value, and close date if known.",
          "Update lead statuses as activity happens — move leads through stages (new, contacted, active, under contract, closed, lost).",
          "Tag every contact on creation: buyer, seller, vendor, past client, sphere, or referral source.",
          "Make sure each contact has complete info: name, phone, email, and source.",
          "Periodically audit the pipeline for stale leads, duplicate contacts, or wrong tags, and clean them up.",
        ],
      },
    ],
    qualityStandards:
      "Every contact has at least one tag. No duplicate records. Pipeline stages reflect the true status, not the hoped-for status.",
    tools: [{ label: "Follow Up Boss" }],
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "vendor-management",
    code: "MJ-04",
    title: "Vendor Management",
    category: "Team Operations",
    owner: "MJ",
    frequency: "As needed",
    purpose:
      "Keep a reliable, well-organized vendor roster so Seth can recommend trusted partners to clients without delay.",
    steps: [
      {
        actions: [
          "When you find a new vendor, add them to the vendor list sheet: name, company, service category, phone, email, and any notes from Seth on quality or fit.",
          "Create or update the vendor's contact in Follow Up Boss with the \"vendor\" tag and a service sub-tag (lender, inspector, contractor, photographer, etc.).",
          "Update vendor records whenever contact info or services change.",
          "Archive or flag vendors who are no longer in use or no longer recommended.",
        ],
      },
    ],
    qualityStandards:
      "The vendor sheet and FUB always match. Every vendor has a clear service category. Notes capture Seth's preferences so the list is genuinely useful — not just a directory.",
    tools: [{ label: "Vendor list sheet" }, { label: "Follow Up Boss" }],
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "lead-client-support",
    code: "MJ-05",
    title: "Lead & Client Support",
    category: "Team Operations",
    owner: "MJ",
    frequency: "Daily / Ongoing",
    purpose:
      "Respond quickly and professionally to inbound leads, coordinate follow-up, and keep client communication moving — without Seth managing every step.",
    steps: [
      {
        actions: [
          "Monitor inbound leads across email, FUB, and any lead-gen platforms.",
          "Respond to new leads within two hours during business hours using the standard intake response.",
          "Capture the basics: timeline, location, budget, buyer or seller, and source.",
          "Add the lead to FUB right away with proper tags and assign next steps.",
          "Coordinate follow-up — schedule calls, send follow-up emails, or route to Seth when warranted.",
          "Schedule appointments at Seth's direction and send calendar invites with all the details.",
        ],
      },
    ],
    qualityStandards:
      "No lead waits more than two business hours for a first response. Every lead is in FUB before the day ends. Appointment invites include address, contact info, and any prep notes.",
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "scheduling-coordination",
    code: "MJ-06",
    title: "Scheduling & Administrative Coordination",
    category: "Team Operations",
    owner: "MJ",
    frequency: "As needed",
    purpose:
      "Handle all scheduling logistics — meetings, reservations, conference rooms — so Seth's day runs smoothly and clients feel taken care of from the first touchpoint.",
    steps: [
      {
        actions: [
          "Book conference rooms at Office Evolution when Seth needs meeting space; confirm date, time, and room setup.",
          "Make restaurant reservations for client meetings or dinners; confirm party size, time, and any preferences (private table, dietary notes).",
          "Send confirmations to everyone involved — client, Seth, and any vendor or third party.",
          "Add every confirmed appointment to Seth's calendar with full details: location, attendees, purpose, and prep notes.",
          "Send same-day or day-before reminders for high-stakes meetings.",
          "Manage scheduling for listings and transactions (inspections, walkthroughs, closings) and keep all parties aligned.",
        ],
      },
    ],
    qualityStandards:
      "No double-bookings. Every calendar event has a location and context. Client-facing confirmations are warm and professional.",
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "transaction-document-prep",
    code: "MJ-07",
    title: "Transaction & Document Preparation",
    category: "Team Operations",
    owner: "MJ",
    frequency: "Per transaction",
    purpose:
      "Prepare and organize transaction documents so files are clean, complete, and ready for signatures — protecting both clients and Seth from delays or errors.",
    steps: [
      {
        actions: [
          "When a property goes active or under contract, build the file using the standard transaction folder structure.",
          "Prepare buyer or seller documents from current templates; fill every field with verified information.",
          "Order documents for signature correctly and route them through the e-signature platform with Seth and the client tagged.",
          "Store fully executed copies in the transaction folder and update the file index.",
          "Flag any missing documents, signatures, or disclosures and notify Seth right away.",
        ],
      },
    ],
    qualityStandards:
      "Every transaction file mirrors the standard structure. No document goes to a client without a final review. Executed copies are saved within 24 hours of signature.",
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "pre-listing-prep",
    code: "MJ-08",
    title: "Pre-Listing Preparation",
    category: "Team Operations",
    owner: "MJ",
    frequency: "Per listing",
    purpose:
      "Turn property walkthrough notes into polished, client-facing documents that reflect Seth's standards and set the listing up for success before it hits the market.",
    steps: [
      {
        actions: [
          "After Seth completes the property walkthrough, gather his notes and observations.",
          "Build the Pre-Listing Property Walkthrough Checklist & Observations document from the brand template.",
          "Organize the notes by room or category — repairs needed, staging recommendations, deferred maintenance, highlights.",
          "Refine the language so it's professional, readable, and free of internal shorthand.",
          "Apply consistent formatting, branded headers, and any photos or visuals that improve clarity.",
          "Submit the document to Seth for review before it's shared with the client.",
        ],
      },
    ],
    qualityStandards:
      "The document is client-ready — no typos, no internal abbreviations, consistent with brand templates. The tone reflects a luxury, professional standard.",
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "listing-mls-drafting",
    code: "MJ-09",
    title: "Listing Preparation & MLS Drafting",
    category: "Team Operations",
    owner: "MJ",
    frequency: "Per listing",
    purpose:
      "Draft accurate, well-written MLS listings so properties launch with strong descriptions, complete data, and high-quality presentation from the first impression.",
    steps: [
      {
        actions: [
          "Gather listing inputs from Seth: property details, features, lot info, tax info, photo set, and any positioning notes.",
          "Draft the listing in the MLS — fill every field accurately, including specs, features, and disclosures.",
          "Upload listing photos in the right order; lead with the strongest exterior shot unless directed otherwise.",
          "Write the property description: lead with the most compelling feature, follow with key details, close with lifestyle/location appeal. Keep the tone in Seth's brand voice.",
          "Review the full listing for accuracy — square footage, beds, baths, lot size, schools, taxes — against source documents.",
          "Submit the draft to Seth for final approval before activation.",
        ],
      },
    ],
    qualityStandards:
      "Zero data errors on activation. The description reads cleanly — no clichés, no filler. Photos are in an intentional order. Nothing goes live without Seth's sign-off.",
    tools: [
      { label: "MLS platform" },
      { label: "Listing photo set" },
      { label: "Property data sheet" },
    ],
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },
  {
    slug: "brand-document-development",
    code: "MJ-10",
    title: "Brand Alignment & Document Development",
    category: "Team Operations",
    owner: "MJ",
    frequency: "Ongoing",
    purpose:
      "Make sure every client-facing document — new or existing — reflects a clean, luxury, professional brand image consistent with Seth's standards.",
    steps: [
      {
        actions: [
          "When refining an existing document, audit it for brand consistency, formatting, typography, layout, and tone.",
          "Apply the standard brand template — fonts, colors, logo placement, spacing — to bring it in line.",
          "Rewrite or polish copy where needed to elevate the tone and remove anything that feels generic or off-brand.",
          "Redesign the document when refining isn't enough — rebuild it from the brand template.",
          "Save the finished document to the master templates folder so future use stays consistent.",
          "Flag any document type that doesn't yet have a brand-aligned template and propose creating one.",
        ],
      },
    ],
    qualityStandards:
      "Every client-facing document looks like it came from the same firm. Templates are reused, not rebuilt each time. The visual presentation matches a luxury, professional standard.",
    createdBy: "The SLG Team",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "May 2026",
    status: "Live",
  },

  /* ───────────────────────── MARKET REPORTS ───────────────────────── */
  {
    slug: "center-point-farm-market-report",
    code: "S-01",
    title: "Center Point Farm Market Report",
    category: "Market Reports",
    owner: "Eunice / Marketing",
    frequency: "Per report",
    purpose:
      "Create and send the Center Point Farm neighborhood market report as a direct-mail piece, keeping neighbors informed about their local real estate market.",
    steps: [
      {
        title: "Step 1 — Pull the MLS data",
        actions: [
          "Log in to Bright MLS and go to the Residential section.",
          "Open the Closed tab and set the date range to the last 0–180 days (extend it if needed to capture at least 10 properties).",
          "Also review Active and Pending listings for a fuller market picture.",
        ],
      },
      {
        title: "Step 2 — Update the Canva template",
        actions: [
          "Open the Center Point Farm Market Report template in Canva.",
          "Update it with the latest Bright MLS data.",
          "Make sure the design is clean, accurate, and on-brand.",
          "Download the finished design as a JPEG or PNG.",
        ],
      },
      {
        title: "Step 3 — Build the mailer in Wise Pelican",
        actions: [
          "Log in to Wise Pelican and start a new mailer.",
          "Upload the JPEG/PNG from Canva.",
          "Adjust the layout so everything fits and there are no misaligned gaps.",
        ],
      },
      {
        title: "Step 4 — Finalize and send",
        actions: [
          "Select the pre-uploaded Center Point Farm recipient list.",
          "Confirm Seth Lejeune's address is on the list.",
          "Review the final mailer for accuracy and alignment.",
          "Check out and confirm the mailer for distribution.",
        ],
      },
    ],
    estimatedTime: "1–2 hours",
    definitionOfDone:
      "The mailers have been successfully checked out and confirmed for delivery in Wise Pelican.",
    tools: [
      { label: "Bright MLS" },
      { label: "Canva" },
      { label: "Wise Pelican" },
    ],
    resources: [
      {
        label: "Loom walkthrough (part 1)",
        url: "https://www.loom.com/share/687016646b494030a61c7273e5b653df",
      },
      {
        label: "Loom walkthrough (part 2)",
        url: "https://www.loom.com/share/30f2ad2d02cc47ceb502a8911000eb03",
      },
    ],
    createdBy: "Eunice (Atlas Assistants)",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "Jun 20, 2024",
    status: "Live",
  },
  {
    slug: "rivercrest-market-report",
    code: "S-02",
    title: "Rivercrest Market Report",
    category: "Market Reports",
    owner: "Eunice / Marketing",
    frequency: "Per report",
    purpose:
      "Create the Rivercrest neighborhood market report, keeping residents informed about local real estate trends and statistics.",
    steps: [
      {
        title: "Step 1 — Pull the MLS data",
        actions: [
          "Log in to Bright MLS and go to the Residential section.",
          "Open the Closed tab and set the date range to the last 0–180 days (extend it if needed to capture at least 20 properties).",
          "Review Active, Closed, Active Under Contract, and Pending listings for a complete market picture.",
        ],
      },
      {
        title: "Step 2 — Generate the market stats",
        actions: [
          "Compile data on sold properties: sale prices, days on market, and other key metrics.",
          "Collect active and pending listing data for a full market overview.",
        ],
      },
      {
        title: "Step 3 — Update the Canva template",
        actions: [
          "Open the Rivercrest Market Report template in Canva.",
          "Update it with the latest Bright MLS data.",
          "Make sure the design is clean and accurately reflects the market.",
          "Download the finished design as a JPEG or PNG.",
        ],
      },
      {
        title: "Step 4 — Build the mailer in Wise Pelican",
        actions: [
          "Log in to Wise Pelican and start a new mailer.",
          "Upload the JPEG/PNG from Canva.",
          "Adjust the layout so everything fits cleanly with no misaligned gaps.",
        ],
      },
      {
        title: "Step 5 — Finalize and send",
        actions: [
          "Select the pre-uploaded Rivercrest recipient list.",
          "Confirm Seth Lejeune's address is on the list.",
          "Review the final mailer for accuracy and alignment.",
          "Check out and confirm the mailer for distribution.",
        ],
      },
    ],
    estimatedTime: "1–2 hours",
    definitionOfDone:
      "The market report mailers have been successfully checked out and confirmed for delivery in Wise Pelican.",
    tools: [
      { label: "Bright MLS" },
      { label: "Canva" },
      { label: "Wise Pelican" },
    ],
    createdBy: "Eunice",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "Aug 28, 2024",
    status: "Live",
  },

  /* ───────────────────────── MARKETING & CONTENT ───────────────────────── */
  {
    slug: "video-editing-publishing",
    code: "S-03",
    title: "Video Editing & Publishing",
    category: "Marketing & Content",
    owner: "Eunice / Marketing",
    frequency: "Per episode",
    purpose:
      "Edit videos, create show notes, design cover photos, and publish to YouTube and Captivate — keeping video production consistent and high quality.",
    steps: [
      {
        title: "Step 1 — Edit in Adobe Premiere Pro",
        actions: [
          "Open Premiere Pro and create a new project.",
          "Import the raw footage and any other media you need.",
          "Edit: trim and cut clips, add transitions, text overlays, and effects, and balance audio (add music or voiceover as needed).",
          "Review for quality, then export the final video (MP4 or MOV).",
        ],
      },
      {
        title: "Step 2 — Create show notes in Descript",
        actions: [
          "Log in to Descript and upload the exported video.",
          "Use Descript to transcribe the video and generate show notes.",
          "Review the show notes for accuracy and completeness, then export them.",
        ],
      },
      {
        title: "Step 3 — Design the YouTube cover in Canva",
        actions: [
          "Open Canva and select the YouTube Thumbnail template.",
          "Design the cover with branding, text, and images.",
          "Match YouTube's recommended dimensions, then download as a JPEG or PNG.",
        ],
      },
      {
        title: "Step 4 — Send to Seth and Jenn for approval",
        actions: [
          "Email the final video, show notes, and cover photo to Seth and Jenn.",
          "Request feedback and approval, and make any revisions they ask for.",
        ],
      },
      {
        title: "Step 5 — Publish to YouTube and Captivate",
        actions: [
          "Upload the approved video to YouTube; add show notes to the description, set the title/tags/metadata, and upload the cover as the thumbnail. Publish.",
          "Upload the video to Captivate with show notes and metadata, then publish.",
        ],
      },
    ],
    estimatedTime: "2–3 hours",
    definitionOfDone:
      "The video is edited, show notes are written, the cover is designed, and the content is published on both YouTube and Captivate with Seth and Jenn's approval.",
    tools: [
      { label: "Adobe Premiere Pro" },
      { label: "Descript" },
      { label: "Canva" },
      { label: "YouTube" },
      { label: "Captivate" },
    ],
    createdBy: "Eunice",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "Aug 28, 2024",
    status: "Live",
  },
  {
    slug: "editing-scheduling-reels",
    code: "S-04",
    title: "Editing & Scheduling Reels",
    category: "Marketing & Content",
    owner: "Eunice / Marketing",
    frequency: "Per batch of reels",
    purpose:
      "Edit and schedule video reels — uploading, trimming, captioning, and sharing across platforms — so reels are optimized and published consistently.",
    steps: [
      {
        title: "Step 1 — Upload to OPUS Clips",
        actions: [
          "Log in to OPUS Clips and upload the finished episode video.",
          "Wait for OPUS to process and generate the initial clips.",
        ],
      },
      {
        title: "Step 2 — Edit the clips",
        actions: [
          "Open the generated clips in OPUS.",
          "Review them and find the \"red meat\" parts to cut (anything less engaging or off-topic).",
          "Trim each clip into a tight, engaging reel, then save.",
        ],
      },
      {
        title: "Step 3 — Create captions",
        actions: [
          "Pull or create captions from the OPUS subtitles.",
          "Make sure they're accurate and synced to the video.",
          "Edit for clarity and brevity if needed.",
        ],
      },
      {
        title: "Step 4 — Add hashtags",
        actions: [
          "Prepare a list of relevant hashtags.",
          "Always include #AnuskyGetsItDone and #AskSethAnything.",
          "Add any other hashtags relevant to the content and audience.",
        ],
      },
      {
        title: "Step 5 — Schedule on Instagram & Facebook",
        actions: [
          "Log in to Meta Business Suite and go to the MillenniUP account.",
          "Upload the reel to both Instagram and Facebook with captions and hashtags.",
          "Schedule the post for the right date and time, and invite Seth and Jenn as collaborators if needed.",
        ],
      },
      {
        title: "Step 6 — Post to YouTube Shorts",
        actions: [
          "Log in to YouTube and upload the reel as a Short.",
          "Add captions and hashtags in the description, and link the full episode.",
          "Publish the Short.",
        ],
      },
    ],
    estimatedTime: "1–2 hours per 5–8 reels",
    definitionOfDone:
      "The reel is edited, captions and hashtags are added, and it's scheduled or published on Instagram, Facebook, and YouTube Shorts with the full episode link included.",
    tools: [
      { label: "OPUS Clips" },
      { label: "Meta Business Suite" },
      { label: "YouTube" },
    ],
    createdBy: "Eunice Mendres",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "Aug 28, 2024",
    status: "Live",
  },
  {
    slug: "ai-content-reels-creation",
    code: "S-05",
    title: "AI Content & Reels Creation",
    category: "Marketing & Content",
    owner: "Eunice / Marketing",
    frequency: "Per reel",
    purpose:
      "Create short-form, AI-driven reels for Seth's platforms — keeping content consistent, efficient, and high-quality.",
    steps: [
      {
        title: "Step 1 — Source an article",
        actions: [
          "Open Seth's custom GPT prompt and generate potential articles.",
          "Review them and pick one that fits Seth's brand, niche, or current marketing focus.",
        ],
      },
      {
        title: "Step 2 — Create the voiceover",
        actions: [
          "Copy the script from the chosen article.",
          "Paste it into ElevenLabs and generate Seth's AI voice narration.",
          "Download the finished audio file.",
        ],
      },
      {
        title: "Step 3 — Create the video avatar",
        actions: [
          "Upload the ElevenLabs audio into HeyGen.",
          "Select Seth's avatar with a transparent background and sync the narration.",
          "Export the video file.",
        ],
      },
      {
        title: "Step 4 — Edit in CapCut",
        actions: [
          "Import the HeyGen video into CapCut.",
          "Add subtitle captions and on-brand title text.",
          "Add 3 images or clips related to the article to keep the reel dynamic.",
          "Layer Seth's transparent avatar over the clips, then check timing and flow.",
        ],
      },
      {
        title: "Step 5 — Final review & export",
        actions: [
          "Watch the full reel and confirm: audio matches visuals, captions are accurate and well-timed, the title is formatted correctly, and the visuals are relevant.",
          "Export in high resolution (MP4, optimized for Instagram, TikTok, and Facebook).",
        ],
      },
    ],
    estimatedTime: "30 minutes per reel",
    definitionOfDone:
      "The reel includes Seth's avatar, synced narration, captions, title text, and supporting visuals; it's been reviewed for quality, branding, and accuracy; and the final file is exported and ready to upload.",
    tools: [
      { label: "Seth's Custom GPT Prompt" },
      { label: "ElevenLabs (voice)" },
      { label: "HeyGen (AI avatar)" },
      { label: "CapCut (editing)" },
    ],
    createdBy: "Eunice Mendres",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "Aug 25, 2025",
    status: "Live",
  },

  /* ───────────────────────── ADMIN & SYSTEMS ───────────────────────── */
  {
    slug: "importing-contacts-fub",
    code: "S-06",
    title: "Importing Contacts into Follow Up Boss",
    category: "Admin & Systems",
    owner: "Eunice / Admin",
    frequency: "As needed",
    purpose:
      "Import contacts into Follow Up Boss so all client and lead information is accurately uploaded for effective follow-up and communication.",
    steps: [
      {
        title: "Step 1 — Prepare the contact list",
        actions: [
          "Open the contact list (CSV) in Excel or Google Sheets.",
          "Make sure it's formatted with columns for First Name, Last Name, Email, Phone Number, and any other relevant details.",
          "Save the file as a CSV.",
        ],
      },
      {
        title: "Step 2 — Go to the import section",
        actions: [
          "Go to followupboss.com and log in.",
          "Click the Admin tab in the top menu, then select Import Contacts.",
        ],
      },
      {
        title: "Step 3 — Upload and map the list",
        actions: [
          "Click Choose File and select the prepared CSV.",
          "Map the file columns to the matching Follow Up Boss fields (First Name, Last Name, Email, Phone Number).",
          "Review the data for accuracy.",
        ],
      },
      {
        title: "Step 4 — Finalize the import",
        actions: [
          "Select any tags or sources to categorize the contacts.",
          "Click Import and wait for the confirmation message.",
        ],
      },
      {
        title: "Step 5 — Verify",
        actions: [
          "Go to the People tab and review the newly imported contacts.",
          "Confirm everyone appears correctly with their details intact.",
          "Fix any errors and re-import if needed.",
        ],
      },
    ],
    estimatedTime: "20–30 minutes",
    definitionOfDone:
      "All contacts are successfully imported, categorized, and verified in Follow Up Boss.",
    tools: [
      { label: "Follow Up Boss" },
      { label: "CSV file of contacts" },
      { label: "Excel / Google Sheets" },
    ],
    createdBy: "Eunice",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "2025",
    status: "Live",
  },
  {
    slug: "business-cards-vistaprint",
    code: "S-07",
    title: "Business Cards — Vistaprint",
    category: "Admin & Systems",
    owner: "Eunice / Admin",
    frequency: "As needed",
    purpose:
      "Order soft-touch business cards on Vistaprint, keeping the ordering process consistent and high-quality.",
    steps: [
      {
        title: "Step 1 — Access Vistaprint",
        actions: [
          "Go to vistaprint.com and log in to the Vistaprint account.",
        ],
      },
      {
        title: "Step 2 — Select soft-touch cards",
        actions: [
          "Search for \"Soft Touch Business Cards.\"",
          "Choose the card size and finish, then click Start Designing.",
        ],
      },
      {
        title: "Step 3 — Upload the design",
        actions: [
          "Click Upload Your Design.",
          "Upload the business card design created in Canva and adjust placement for proper alignment.",
          "Review the preview to confirm all details are correct.",
        ],
      },
      {
        title: "Step 4 — Review the order",
        actions: [
          "Double-check the design, quantity, and finish.",
          "Click Continue, then enter the shipping address and pick a shipping option.",
          "Review the final order summary.",
        ],
      },
      {
        title: "Step 5 — Place the order",
        actions: [
          "Enter payment details and complete the transaction.",
          "Save the order confirmation for reference.",
        ],
      },
    ],
    estimatedTime: "15–20 minutes",
    definitionOfDone:
      "The business card order is successfully placed and an order confirmation email is received.",
    tools: [
      { label: "Vistaprint account" },
      { label: "Canva business card design" },
      { label: "Payment method" },
      { label: "Shipping address" },
    ],
    createdBy: "Eunice",
    reviewedBy: "Seth Lejeune",
    lastUpdated: "2025",
    status: "Live",
  },
];
