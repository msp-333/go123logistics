// content/posts.ts
export type Post = {
  slug: string;
  title: string;
  date: string;       // ISO (YYYY-MM-DD)
  image: string;      // public path under /public/images
  excerpt: string;
  content: string[];  // paragraphs
  tags?: string[];
};

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const posts: Post[] = [
  {
    slug: "shipping-to-from-canada-border",
    title: "Shipping to and from Canada: What to Expect at the Border",
    date: "2019-04-16",
    image: `${base}/images/blog-canada.png`,
    excerpt:
      "Documents to prepare, when a broker helps, and the low-value pathway that can speed things up.",
    tags: ["International", "Customs"],
    content: [
      "First-time cross-border shippers often worry about customs. A little prep removes most of the friction. Decide the shipment's declared value up front and collect the paperwork before the truck rolls.",
      "For low-value entries, certain Canadian shipments under a set threshold can clear with a simplified process. For anything above that amount, use a licensed broker — they're affordable and they coordinate the hand-off with carriers and customs so your freight isn't idling.",
      "At minimum be ready with: a Commercial Invoice (or Canada/US Customs Invoice), a Bill of Lading, certificate of origin if applicable, and a clean list of what's in the load with serial numbers or identifying marks. Your carrier will present the BOL at the border; your broker will transmit data ahead of time so officers already know what's coming.",
      "Good news: with the right docs and a broker, the border feels routine — not risky."
    ]
  },

  {
    slug: "scac-codes-explained",
    title: "SCAC Codes Explained (and Why Shippers Use Them)",
    date: "2019-01-23",
    image: `${base}/images/blog-scac.png`,
    excerpt:
      "A short, practical explainer on the Standard Carrier Alpha Code and how it shows up on your docs.",
    tags: ["How-To", "Docs"],
    content: [
      "A SCAC (Standard Carrier Alpha Code) is a short code used to identify carriers in TMS platforms and shipping documents like Bills of Lading.",
      "You'll notice patterns: codes ending in 'U' often identify containerized ocean carriers; 'X' can mark privately owned rail cars; and 'Z' may indicate chassis providers used in intermodal moves. U.S. Customs also references SCACs in electronic pre-clearance workflows.",
      "Bottom line: knowing your partner's SCAC keeps quotes, tracking, and customs records consistent across systems."
    ]
  },

  {
    slug: "international-moves-checklist",
    title: "International Moves: Packing & Paperwork Checklist",
    date: "2018-07-10",
    image: `${base}/images/blog-move.png`,
    excerpt:
      "From labeling to manifests, here’s how to prep a household shipment that will live at sea for weeks.",
    tags: ["International", "How-To"],
    content: [
      "International relocations are marathons, not sprints. Every box you load becomes part of a manifest that customs will review — so labeling and detail matter.",
      "Use sturdy cartons, double-tape bottoms, and individually wrap fragile items. Keep manuals and serial numbers in a single folder you can hand to customs or your broker.",
      "Category tips: unplug appliances early (fridges 24 hours prior), remove microwave plates, double-pack screens, pad furniture edges, and flat-pack wardrobes when possible. Candles, plants, and other restricted goods don't ship.",
      "Three phases to remember: pack thoroughly, build the detailed manifest as you load, then unpack with care at destination."
    ]
  },

  {
    slug: "specialty-over-dimensional-freight",
    title: "Specialty & Over-Dimensional Freight: What to Plan For",
    date: "2018-05-24",
    image: `${base}/images/blog-oversize.png`,
    excerpt:
      "Permits, escorts, cranes, and the timing realities behind big moves — by road, rail, or RoRo.",
    tags: ["Projects", "Oversize"],
    content: [
      "Boats, construction gear, and plant moves require a different playbook than standard freight. Start with two questions: how do we load/unload and which mode(s) make sense — RoRo, crane lift, rail, or over-the-road?",
      "Expect permit work for over-width, over-height, over-length, and overweight. Costs vary by state and route; police escorts and tolls add to the plan. If cranes are involved, you'll need lift diagrams and crew scheduling.",
      "Rail can be cost-effective between ramp cities, but it isn't fast. Build time for drayage in and out of the ramps and coordinate customs if you cross borders.",
      "Oversize moves succeed when time buffers and documentation are treated as cargo — not accessories."
    ]
  },

  {
    slug: "limited-access-ltl",
    title: "Limited-Access Locations in LTL: What Carriers Mean",
    date: "2018-01-29",
    image: `${base}/images/blog-limited.png`,
    excerpt:
      "Why some pickup/delivery sites trigger accessorials — and how to avoid surprise fees.",
    tags: ["LTL", "Fees"],
    content: [
      "In LTL, carriers flag certain pickup and delivery sites as 'limited access.' It reflects real constraints — restricted hours, security gates, no docks, or extra handling — that slow down a route.",
      "Common examples include construction sites, mines and quarries, fields and remote yards, schools or churches, and other locations with special entry rules. These stops often carry an added fee and longer service windows.",
      "Best practice: disclose the exact site type when you book, include contact info for on-site staff, and request the right equipment (liftgate, residential service, etc.) to keep costs predictable."
    ]
  },

  {
    slug: "freight-brokerage-evolving-tech",
    title: "Freight Brokerage Is Evolving — Here’s What Matters",
    date: "2018-02-02",
    image: `${base}/images/blog-brokerage.png`,
    excerpt:
      "TMS and automation aren't hype — they change how shipments are booked and tracked.",
    tags: ["Technology", "Brokerage"],
    content: [
      "Technology keeps compressing the time between quote and delivery. Transportation Management Systems (TMS) centralize rates, automate paperwork, and give customers self-service tools for instant booking and Bills of Lading.",
      "Final-mile experiments point to faster local delivery in hard-to-reach areas. The headline isn't gadgets — it's visibility: live updates, status changes, and e-docs that move with the freight.",
      "For shippers, the takeaway is simple: pick partners who integrate well, and expect real-time data by default."
    ]
  },

  {
    slug: "avoid-extra-charges-specialty-freight",
    title: "Avoiding Extra Charges on Regulated & Specialty Freight",
    date: "2018-02-06",
    image: `${base}/images/blog-fees.png`,
    excerpt:
      "Alcohol, tobacco, and other regulated goods change the rules — and sometimes the bill.",
    tags: ["Compliance", "Fees"],
    content: [
      "Products like alcohol and tobacco live under constantly shifting rules. Rates and paperwork change more often than most categories, so quoting directly with a single carrier can be slow and still miss better options.",
      "The smarter path is to compare mode and carrier digitally, confirm accessorials up front, and keep your compliance file tight so freight isn't held at transfer points.",
      "If you ship regulated SKUs frequently, maintain a checklist for licenses, route restrictions, and delivery ID requirements by state."
    ]
  },

  /* ---------- The three slugs your home cards link to ---------- */

  {
    slug: "ltl-vs-ftl",
    title: "LTL vs FTL: What’s Right for Your Shipment?",
    date: "2025-01-12",
    image: `${base}/images/blog-1.png`,
    excerpt:
      "Understand cost drivers, timelines, and handling risks so you can choose the mode that fits your freight.",
    tags: ["How-To", "LTL", "FTL"],
    content: [
      "Choosing between LTL (less-than-truckload) and FTL (full truckload) comes down to space, speed, and risk. Match your shipment's size and sensitivity to the realities of each network.",
      "LTL shares a trailer with other shippers and passes through terminals. That keeps pricing efficient for smaller loads but adds handling and variability.",
      "FTL dedicates the trailer to your freight from pickup to delivery. There are fewer touches, and routing is point-to-point — typically faster and more predictable.",
      "Cost drivers: LTL rates use freight class, density, lane, and accessorials (liftgate, limited access, residential, appointment). FTL pricing is market-based — miles, lane balance, seasonality, and equipment type.",
      "When to choose LTL: a few pallets, flexible delivery windows, and robust packaging. When to choose FTL: time-critical or fragile/high-value loads, or when you're using a large share of the trailer.",
      "Quoting checklist: dimensions and weight per pallet, total pallet count, stackable or not, NMFC class if applicable, pickup/delivery constraints, and any special equipment needed.",
      "Takeaway: compare total landed cost plus service reliability — sometimes FTL becomes competitive when you approach a large share of trailer space."
    ]
  },

  {
    slug: "scac-codes-guide",
    title: "SCAC Codes: A Quick Guide for Shippers",
    date: "2025-01-05",
    image: `${base}/images/blog-2.png`,
    excerpt:
      "What SCAC codes are, where they appear, and how they keep your quotes, tracking, and customs records consistent.",
    tags: ["Docs", "Operations"],
    content: [
      "A SCAC (Standard Carrier Alpha Code) is a short identifier used to uniquely reference transportation companies across shipping systems.",
      "Where you'll see it: Bills of Lading, rate confirmations, carrier portals, EDI messages, and customs records.",
      "Why it matters: using the wrong SCAC can misroute updates, fail an EDI transmission, or slow down border processing.",
      "How to find the right one: check the carrier's website or rate sheet, confirm with your rep in writing, and store it in your TMS/address book so it's consistent.",
      "Pro tip: make SCAC a required field for carrier records — it keeps quoting, booking, and tracking aligned across teams."
    ]
  },

  {
    slug: "prevent-freight-damage",
    title: "How to Prevent Damage in Long-Haul Freight",
    date: "2024-12-18",
    image: `${base}/images/blog-3.png`,
    excerpt:
      "Packaging tactics, pallet strategy, and chain-of-custody practices that dramatically reduce exceptions.",
    tags: ["Packaging", "Quality", "LTL"],
    content: [
      "Most damage claims trace back to weak packaging, poor palletization, and unclear handling. Fix those and long-haul exceptions drop dramatically.",
      "Packaging: sturdy cartons sized to contents, remove voids, double-tape bottoms, and add corner protection.",
      "Pallets: sound deck boards, even weight, zero overhang, brick-stack layers, and secure with corner boards/straps and proper stretch-wrap.",
      "Environment & labeling: desiccants for moisture-sensitive goods, reefers with verified set-points when needed, and only labels you can actually support.",
      "Chain of custody: photos before wrap, at pickup, and at delivery; seal numbers on the BOL; note exceptions clearly on the POD with photos.",
      "At delivery: inspect before signing and be specific on the POD — 'subject to inspection' offers little protection."
    ]
  },

  {
    slug: "self-driving-trucks-outlook",
    title: "Self-Driving Trucks: What Shippers Should Watch",
    date: "2018-02-09",
    image: `${base}/images/blog-autonomous.png`,
    excerpt:
      "Autonomy is arriving in layers — driver assist first, long corridors later. Plan for blended fleets.",
    tags: ["Technology", "TL"],
    content: [
      "Autonomous trucking will arrive gradually: advanced driver-assist on highways, hub-to-hub pilots on defined lanes, and human hands for city complexity and exceptions.",
      "The impact for shippers in the near term is less about driverless loads and more about safety, fuel efficiency, and better ETAs from connected trucks.",
      "Build carrier mixes that can adopt new tech without disrupting service levels, and keep your data clean — autonomy feeds on accurate shipment info."
    ]
  }
];
