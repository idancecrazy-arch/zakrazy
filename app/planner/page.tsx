'use client'

import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

type TaskStatus = 'done' | 'in-progress' | 'pending'
type DeadlineUrgency = 'wedding' | 'critical' | 'soon' | 'upcoming'
type VendorStatus = 'confirmed' | 'deposit-paid' | 'pending' | 'in-discussion'

type Task = {
  id: string
  title: string
  category: string
  status: TaskStatus
  assignee: string
  dueLabel: string
  notes: string
}

type Deadline = {
  id: string
  date: string
  label: string
  title: string
  bullets: { id: string; text: string }[]
  urgency: DeadlineUrgency
}

type BudgetItem = {
  id: string
  item: string
  cost: string
  paid: boolean
}

type GuestScenario = {
  id: string
  numGuests: number
  costPerTable: number
  seatsPerTable: number
}

type Vendor = {
  id: string
  vendor: string
  service: string
  category: string
  contact: string
  phone: string
  email: string
  budget: string
  status: VendorStatus
  notes: string
}

// ── Utilities ──────────────────────────────────────────────────────────────────

let _seq = 0
const uid = () => `${Date.now()}-${++_seq}`

// ── Initial Data ───────────────────────────────────────────────────────────────

const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'd1', date: 'May 5, 2026', label: 'TOMORROW', urgency: 'critical',
    title: 'Wedding Planner Call',
    bullets: [
      { id: 'b1', text: 'Discuss small decoration coordination' },
      { id: 'b2', text: 'Day-of table setup & guest check-in logistics' },
      { id: 'b3', text: 'Confirm: decoration setup and day-of coordination' },
      { id: 'b4', text: 'Status update: guest count (100–120), vendor confirmations, timeline review' },
    ],
  },
  {
    id: 'd2', date: 'June 12, 2026', label: '⏰ CRITICAL', urgency: 'critical',
    title: 'Send RSVPs & Confirm Golden Unicorn',
    bullets: [
      { id: 'b5', text: 'Send formal invitations to all guests' },
      { id: 'b6', text: 'RSVP deadline: ~July 15 (6 weeks before wedding)' },
      { id: 'b7', text: 'Confirm final menu selection with Golden Unicorn' },
      { id: 'b8', text: 'Confirm final guest count accommodation' },
      { id: 'b9', text: 'Discuss any dietary restrictions' },
    ],
  },
  {
    id: 'd3', date: 'August 15, 2026', label: '⏰ CRITICAL', urgency: 'soon',
    title: 'Get Items Printed',
    bullets: [
      { id: 'b10', text: 'Table number frames' },
      { id: 'b11', text: 'Ceremony programs' },
      { id: 'b12', text: 'Place cards / seating cards' },
      { id: 'b13', text: 'Guest list for check-in table' },
      { id: 'b14', text: 'Menu cards (optional)' },
      { id: 'b15', text: 'Allow 2–3 weeks for printing and delivery' },
    ],
  },
  {
    id: 'd4', date: 'August 22, 2026', label: '⏰ CRITICAL', urgency: 'soon',
    title: 'Finalize Table Arrangements & Seating Chart',
    bullets: [
      { id: 'b16', text: 'Complete final table layout and seating assignments' },
      { id: 'b17', text: 'Coordinate with reception venue on setup preferences' },
      { id: 'b18', text: 'Finalize any last-minute guest changes' },
      { id: 'b19', text: 'Create table numbers and place cards' },
    ],
  },
  {
    id: 'd5', date: 'September 10, 2026', label: '⏰ CRITICAL', urgency: 'upcoming',
    title: 'Prepare All Ceremony Flowers (2 Days Before)',
    bullets: [
      { id: 'b20', text: 'Make bridal bouquet' },
      { id: 'b21', text: 'Prepare flower girl rose basket' },
      { id: 'b22', text: 'Any altar or ceremony arch arrangements' },
      { id: 'b23', text: 'Ensure flower freshness' },
    ],
  },
  {
    id: 'd6', date: 'September 12, 2026', label: '🎊 WEDDING DAY', urgency: 'wedding',
    title: "Christine & Michael's Wedding",
    bullets: [
      { id: 'b24', text: "Ceremony: 2:00 PM at St. Joseph's Church, Greenwich Village" },
      { id: 'b25', text: 'Reception setup: arrive 4:00 PM at Golden Unicorn' },
      { id: 'b26', text: 'Reception: 5:00 PM – 10:00 PM at Golden Unicorn' },
    ],
  },
]

const INITIAL_TASKS: Task[] = [
  { id: 't1',  category: 'DIY',            status: 'pending',     assignee: '',                   dueLabel: 'Sep 10', notes: '', title: 'Make bridal bouquet' },
  { id: 't2',  category: 'DIY',            status: 'pending',     assignee: '',                   dueLabel: 'Sep 10', notes: '', title: 'Prepare flower girl basket with roses' },
  { id: 't3',  category: 'DIY',            status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Source vases for floral arrangements' },
  { id: 't4',  category: 'Vendors',        status: 'pending',     assignee: '',                   dueLabel: 'Jun 12', notes: '', title: 'Confirm final details with Jin Krista (music)' },
  { id: 't5',  category: 'Vendors',        status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Finalize photographer booking (6 hrs or 8 hrs?)' },
  { id: 't6',  category: 'Vendors',        status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Confirm DJ details and music preferences' },
  { id: 't7',  category: 'Vendors',        status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Coordinate with florist for ceremony arch & centerpieces' },
  { id: 't8',  category: 'Vendors',        status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Confirm lion dancers logistics and timing' },
  { id: 't9',  category: 'Guests',         status: 'in-progress', assignee: '',                   dueLabel: 'Jun 12', notes: '', title: 'Finalize guest count (100 or 120 guests?)' },
  { id: 't10', category: 'Guests',         status: 'pending',     assignee: '',                   dueLabel: 'Jun 12', notes: '', title: 'Send out formal invitations' },
  { id: 't11', category: 'Guests',         status: 'pending',     assignee: '',                   dueLabel: 'Jul 15', notes: '', title: 'Collect RSVPs' },
  { id: 't12', category: 'Ceremony',       status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Finalize ceremony music selections with Jin Krista' },
  { id: 't13', category: 'Ceremony',       status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: "Coordinate with St. Joseph's Church on timing" },
  { id: 't14', category: 'Ceremony',       status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Plan processional and recessional order' },
  { id: 't15', category: 'Reception',      status: 'pending',     assignee: '',                   dueLabel: 'Jun 12', notes: '', title: 'Confirm final menu with Golden Unicorn' },
  { id: 't16', category: 'Reception',      status: 'pending',     assignee: '',                   dueLabel: 'Aug 22', notes: '', title: 'Plan table layout and seating chart' },
  { id: 't17', category: 'Reception',      status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Arrange transportation if needed' },
  { id: 't18', category: 'Design & Style', status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Source materials for bridal bouquet' },
  { id: 't19', category: 'Design & Style', status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Source roses for flower girl basket' },
  { id: 't20', category: 'Design & Style', status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Plan bridesmaid attire (ivory/blush/lilac)' },
  { id: 't21', category: 'Design & Style', status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Finalize groomsmen attire' },
  { id: 't22', category: 'Printing',       status: 'pending',     assignee: '',                   dueLabel: 'Aug 15', notes: '', title: 'Order table number frames' },
  { id: 't23', category: 'Printing',       status: 'pending',     assignee: '',                   dueLabel: 'Aug 15', notes: '', title: 'Order ceremony programs' },
  { id: 't24', category: 'Printing',       status: 'pending',     assignee: '',                   dueLabel: 'Aug 15', notes: '', title: 'Order seating cards / place cards' },
  { id: 't25', category: 'Printing',       status: 'pending',     assignee: '',                   dueLabel: 'Aug 15', notes: '', title: 'Order guest list for check-in table' },
  { id: 't26', category: 'Printing',       status: 'pending',     assignee: '',                   dueLabel: 'Aug 15', notes: '', title: 'Order menu cards (optional)' },
  { id: 't27', category: 'Other',          status: 'in-progress', assignee: 'Christine & Michael', dueLabel: 'Sep 12', notes: '', title: 'Complete marriage prep class' },
  { id: 't28', category: 'Other',          status: 'pending',     assignee: 'Christine',          dueLabel: '',       notes: '', title: 'Wedding dress final fittings' },
  { id: 't29', category: 'Other',          status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Plan rehearsal dinner details' },
  { id: 't30', category: 'Other',          status: 'pending',     assignee: '',                   dueLabel: '',       notes: '', title: 'Arrange wedding day timeline and schedule' },
]

const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  { id: 'bi1',  item: 'Marriage class',               cost: '$195',            paid: true },
  { id: 'bi2',  item: 'Wedding dress',                cost: '$3,380',          paid: true },
  { id: 'bi3',  item: 'Website',                      cost: '$100',            paid: true },
  { id: 'bi4',  item: 'Church ceremony fee',          cost: '$2,500',          paid: true },
  { id: 'bi5',  item: 'Reception deposit',            cost: '$500',            paid: true },
  { id: 'bi6',  item: 'Save the Date',                cost: '$0',              paid: true },
  { id: 'bi7',  item: 'Marriage prep class',          cost: '$200',            paid: false },
  { id: 'bi8',  item: 'Reception (remaining balance)',cost: '$20,300–$23,500', paid: false },
  { id: 'bi9',  item: 'Photography (6 hrs)',          cost: '$3,000',          paid: false },
  { id: 'bi10', item: 'DJ',                           cost: '$3,000',          paid: false },
  { id: 'bi11', item: 'Florals',                      cost: '$3,000',          paid: false },
  { id: 'bi12', item: 'Lion dancers',                 cost: '$1,000',          paid: false },
  { id: 'bi13', item: 'Ceremony music – Jin Krista',  cost: '$2,000',          paid: false },
]

const INITIAL_SCENARIOS: GuestScenario[] = [
  { id: 'gs1', numGuests: 100, costPerTable: 1600, seatsPerTable: 8 },
  { id: 'gs2', numGuests: 120, costPerTable: 1600, seatsPerTable: 8 },
]

const INITIAL_VENDORS: Vendor[] = [
  { id: 'v1', vendor: 'Jin Krista',          service: 'Ceremony Music',         category: 'Music',         contact: 'TBD', phone: '', email: '', budget: '$2,000',           status: 'confirmed',     notes: '' },
  { id: 'v2', vendor: 'Golden Unicorn',      service: 'Reception Venue',        category: 'Venue',         contact: 'TBD', phone: '', email: '', budget: '$20,800–$24,000',  status: 'deposit-paid',  notes: '' },
  { id: 'v3', vendor: 'Photographer',        service: 'Photography (6–8 hrs)',  category: 'Photography',   contact: 'TBD', phone: '', email: '', budget: '$3,000–$4,000',    status: 'pending',       notes: '' },
  { id: 'v4', vendor: 'DJ',                  service: 'Reception Entertainment',category: 'Music',         contact: 'TBD', phone: '', email: '', budget: '$3,000',           status: 'pending',       notes: '' },
  { id: 'v5', vendor: 'Florist',             service: 'Florals & Arrangements', category: 'Florals',       contact: 'TBD', phone: '', email: '', budget: '$3,000',           status: 'pending',       notes: '' },
  { id: 'v6', vendor: 'Lion Dancers',        service: 'Cultural Entertainment', category: 'Entertainment', contact: 'TBD', phone: '', email: '', budget: '$1,000',           status: 'pending',       notes: '' },
  { id: 'v7', vendor: "St. Joseph's Church", service: 'Ceremony Venue',         category: 'Venue',         contact: 'TBD', phone: '', email: '', budget: '$2,500 (paid)',    status: 'confirmed',     notes: '' },
  { id: 'v8', vendor: 'Wedding Planner',     service: 'Overall Coordination',   category: 'Planning',      contact: 'TBD', phone: '', email: '', budget: 'TBD',             status: 'in-discussion', notes: '' },
]

// ── Shared: Inline editable text ───────────────────────────────────────────────

function EditableText({
  value, onChange, className = '', placeholder = 'Click to edit…',
}: {
  value: string
  onChange: (v: string) => void
  className?: string
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const save = () => { setEditing(false); onChange(draft) }
  const cancel = () => { setEditing(false); setDraft(value) }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); save() }
          if (e.key === 'Escape') cancel()
        }}
        className={`${className} bg-warm-cream border-b border-gold-line outline-none w-full min-w-0`}
      />
    )
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => { setEditing(true); setDraft(value) }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setEditing(true); setDraft(value) } }}
      className={`${className} cursor-text hover:bg-warm-cream/60 active:bg-warm-cream rounded-sm px-0.5 -mx-0.5 transition-colors`}
      title="Tap to edit"
    >
      {value || <span className="text-soft-gray/40 italic text-sm">{placeholder}</span>}
    </span>
  )
}

function EditableNumber({
  value, onChange, className = '',
}: {
  value: number
  onChange: (v: number) => void
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  const save = () => {
    setEditing(false)
    const n = parseInt(draft, 10)
    if (!isNaN(n) && n > 0) onChange(n)
    else setDraft(String(value))
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        min={1}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); save() }
          if (e.key === 'Escape') { setEditing(false); setDraft(String(value)) }
        }}
        className={`${className} bg-warm-cream border-b border-gold-line outline-none w-20`}
      />
    )
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => { setEditing(true); setDraft(String(value)) }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setEditing(true); setDraft(String(value)) } }}
      className={`${className} cursor-text hover:bg-warm-cream/60 active:bg-warm-cream rounded-sm px-0.5 -mx-0.5 transition-colors`}
      title="Tap to edit"
    >
      {value}
    </span>
  )
}

// ── Urgency config ─────────────────────────────────────────────────────────────

const URGENCY_STYLES: Record<DeadlineUrgency, { dot: string; card: string; labelColor: string }> = {
  wedding:  { dot: 'bg-lilac',      card: 'border-lilac bg-lilac/10',           labelColor: 'text-dusty-lilac font-semibold' },
  critical: { dot: 'bg-muted-rose', card: 'border-muted-rose bg-muted-rose/10', labelColor: 'text-muted-rose font-semibold' },
  soon:     { dot: 'bg-gold-line',  card: 'border-gold-line bg-pale-gold/20',   labelColor: 'text-deep-ivory' },
  upcoming: { dot: 'bg-pale-gold',  card: 'border-pale-gold bg-ivory',          labelColor: 'text-soft-gray' },
}

const URGENCY_OPTIONS: { value: DeadlineUrgency; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'soon',     label: 'Soon' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'wedding',  label: 'Wedding Day' },
]

// ── Timeline section ───────────────────────────────────────────────────────────

function TimelineSection({
  deadlines,
  onUpdate, onDelete, onAdd,
  onAddBullet, onUpdateBullet, onDeleteBullet,
}: {
  deadlines: Deadline[]
  onUpdate: (id: string, patch: Partial<Deadline>) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onAddBullet: (dlId: string) => void
  onUpdateBullet: (dlId: string, bId: string, text: string) => void
  onDeleteBullet: (dlId: string, bId: string) => void
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
          Critical Deadlines
        </h2>
        <button
          onClick={onAdd}
          className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray hover:text-gold-line transition-colors"
        >
          + Add
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-soft-gray/30" />
        <div className="flex flex-col gap-5 pl-10">
          {deadlines.map(dl => {
            const s = URGENCY_STYLES[dl.urgency]
            return (
              <div key={dl.id} className="relative">
                <div className={`absolute -left-7 top-2 w-3 h-3 rounded-full ${s.dot} ring-2 ring-ivory flex-shrink-0`} />
                <div className={`border rounded-lg p-4 ${s.card}`}>
                  {/* Date / label / urgency / delete row */}
                  <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 flex-1 min-w-0">
                      <EditableText
                        value={dl.date}
                        onChange={v => onUpdate(dl.id, { date: v })}
                        className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray"
                      />
                      <EditableText
                        value={dl.label}
                        onChange={v => onUpdate(dl.id, { label: v })}
                        className={`font-work-sans text-[10px] tracking-[0.2em] uppercase ${s.labelColor}`}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <select
                        value={dl.urgency}
                        onChange={e => onUpdate(dl.id, { urgency: e.target.value as DeadlineUrgency })}
                        className="font-work-sans text-[9px] uppercase bg-transparent border border-soft-gray/30 rounded px-1 py-0.5 text-soft-gray focus:outline-none focus:border-gold-line"
                      >
                        {URGENCY_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => onDelete(dl.id)}
                        className="text-soft-gray/40 hover:text-muted-rose transition-colors w-6 h-6 flex items-center justify-center text-base"
                        aria-label="Delete deadline"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <EditableText
                    value={dl.title}
                    onChange={v => onUpdate(dl.id, { title: v })}
                    className="font-crimson text-lg font-semibold text-dark-taupe mb-3 block w-full"
                  />

                  {/* Bullets */}
                  <ul className="space-y-2">
                    {dl.bullets.map(b => (
                      <li key={b.id} className="flex items-start gap-2 group/bullet">
                        <span className="text-gold-line mt-0.5 flex-shrink-0 text-sm leading-snug">·</span>
                        <EditableText
                          value={b.text}
                          onChange={v => onUpdateBullet(dl.id, b.id, v)}
                          className="font-crimson text-sm text-deep-ivory leading-snug flex-1"
                        />
                        <button
                          onClick={() => onDeleteBullet(dl.id, b.id)}
                          className="text-soft-gray/30 hover:text-muted-rose transition-colors w-5 h-5 flex items-center justify-center text-base flex-shrink-0 opacity-0 group-hover/bullet:opacity-100"
                          aria-label="Remove item"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onAddBullet(dl.id)}
                    className="mt-2.5 font-work-sans text-[9px] tracking-[0.15em] uppercase text-soft-gray/50 hover:text-gold-line transition-colors"
                  >
                    + add item
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Task status config ─────────────────────────────────────────────────────────

const STATUS_PILL: Record<TaskStatus, string> = {
  done:          'bg-gold-line/20 text-deep-ivory border border-gold-line/40',
  'in-progress': 'bg-lilac/20 text-dusty-lilac border border-lilac/40',
  pending:       'bg-soft-gray/20 text-soft-gray border border-soft-gray/40',
}
const STATUS_LABEL: Record<TaskStatus, string> = {
  done: 'Done', 'in-progress': 'In Progress', pending: 'Pending',
}
const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  pending: 'in-progress', 'in-progress': 'done', done: 'pending',
}

// ── Task row ───────────────────────────────────────────────────────────────────

function TaskRow({
  task, allCategories,
  onUpdate, onDelete,
}: {
  task: Task
  allCategories: string[]
  onUpdate: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className={`py-3 border-b border-soft-gray/20 last:border-0 group/task ${task.status === 'done' ? 'opacity-55' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Status toggle */}
        <button
          onClick={() => onUpdate(task.id, { status: STATUS_CYCLE[task.status] })}
          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border border-gold-line/50 flex items-center justify-center hover:border-gold-line transition-colors"
          aria-label={`Status: ${task.status}. Tap to advance.`}
        >
          {task.status === 'done' && (
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
              <path d="M1 4L4 7L10 1" stroke="#C3AF82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {task.status === 'in-progress' && <div className="w-2 h-2 rounded-full bg-dusty-lilac" />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-1">
            <EditableText
              value={task.title}
              onChange={v => onUpdate(task.id, { title: v })}
              className={`font-crimson text-sm text-dark-taupe leading-snug flex-1 ${task.status === 'done' ? 'line-through' : ''}`}
            />
            <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-soft-gray/40 hover:text-deep-ivory w-5 h-5 flex items-center justify-center text-[10px] transition-colors"
                aria-label={showDetails ? 'Hide details' : 'Show details'}
              >
                {showDetails ? '▲' : '▼'}
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-soft-gray/25 hover:text-muted-rose w-5 h-5 flex items-center justify-center text-base transition-colors opacity-0 group-hover/task:opacity-100"
                aria-label="Delete task"
              >
                ×
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-work-sans tracking-wider uppercase whitespace-nowrap ${STATUS_PILL[task.status]}`}>
              {STATUS_LABEL[task.status]}
            </span>

            {/* Category — editable text with datalist suggestions */}
            <CategoryEdit
              value={task.category}
              options={allCategories}
              onChange={v => onUpdate(task.id, { category: v })}
            />

            {task.dueLabel && (
              <EditableText
                value={task.dueLabel}
                onChange={v => onUpdate(task.id, { dueLabel: v })}
                className="font-work-sans text-[9px] tracking-wider uppercase text-muted-rose/80"
              />
            )}

            <EditableText
              value={task.assignee}
              onChange={v => onUpdate(task.id, { assignee: v })}
              placeholder="+ assign"
              className="font-work-sans text-[9px] tracking-wide text-deep-ivory/60 hover:text-gold-line"
            />
          </div>

          {/* Expanded details */}
          {showDetails && (
            <div className="mt-2 space-y-1.5 pl-0">
              {!task.dueLabel && (
                <div className="flex items-center gap-2">
                  <span className="font-work-sans text-[9px] uppercase tracking-wide text-soft-gray/60 flex-shrink-0">Due:</span>
                  <EditableText
                    value={task.dueLabel}
                    onChange={v => onUpdate(task.id, { dueLabel: v })}
                    placeholder="add due date…"
                    className="font-crimson text-xs text-deep-ivory"
                  />
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="font-work-sans text-[9px] uppercase tracking-wide text-soft-gray/60 flex-shrink-0 pt-0.5">Notes:</span>
                <EditableText
                  value={task.notes}
                  onChange={v => onUpdate(task.id, { notes: v })}
                  placeholder="add notes…"
                  className="font-crimson text-xs text-deep-ivory flex-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Inline category editor with datalist for suggestions
function CategoryEdit({ value, options, onChange }: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const listId = `cat-${value}-${Math.random().toString(36).slice(2, 6)}`

  const save = (val = draft) => {
    setEditing(false)
    onChange(val.trim() || value)
  }

  if (editing) {
    return (
      <>
        <input
          autoFocus
          list={listId}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => save()}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); save() }
            if (e.key === 'Escape') { setEditing(false); setDraft(value) }
          }}
          className="font-work-sans text-[9px] tracking-wide uppercase bg-warm-cream border border-gold-line/50 rounded px-1.5 py-0.5 text-soft-gray outline-none w-28"
          placeholder="category…"
        />
        <datalist id={listId}>
          {options.map(o => <option key={o} value={o} />)}
        </datalist>
      </>
    )
  }

  return (
    <button
      onClick={() => { setEditing(true); setDraft(value) }}
      className="font-work-sans text-[9px] tracking-wide uppercase bg-warm-cream/50 border border-soft-gray/30 hover:border-gold-line/50 rounded px-1.5 py-0.5 text-soft-gray transition-colors"
    >
      {value}
    </button>
  )
}

// ── Tasks section ──────────────────────────────────────────────────────────────

function TasksSection({
  tasks, onUpdate, onDelete, onAdd,
}: {
  tasks: Task[]
  onUpdate: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
  onAdd: (category?: string) => void
}) {
  const [activeCategory, setActiveCategory] = useState('All')

  const allCategories = Array.from(new Set(tasks.map(t => t.category))).sort()
  const filterList = ['All', ...allCategories]

  const grouped = allCategories.reduce<Record<string, Task[]>>((acc, cat) => {
    acc[cat] = tasks.filter(t => t.category === cat)
    return acc
  }, {})

  const filteredTasks = activeCategory === 'All' ? tasks : tasks.filter(t => t.category === activeCategory)

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
          Task Board
        </h2>
        <button
          onClick={() => onAdd(activeCategory !== 'All' ? activeCategory : undefined)}
          className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray hover:text-gold-line transition-colors"
        >
          + Add Task
        </button>
      </div>

      <p className="font-crimson italic text-xs text-soft-gray/70 mb-4">
        Tap the circle to cycle status · tap any field to edit
      </p>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {filterList.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-work-sans text-[9px] tracking-[0.15em] uppercase px-2.5 py-1.5 border rounded-full transition-colors min-h-[36px] ${
              activeCategory === cat
                ? 'bg-dark-taupe text-ivory border-dark-taupe'
                : 'bg-transparent text-deep-ivory border-soft-gray/40 hover:border-gold-line'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {activeCategory === 'All'
        ? Object.entries(grouped).map(([cat, catTasks]) => (
          <div key={cat} className="mb-6">
            <div className="flex items-center justify-between mb-1 pb-1 border-b border-soft-gray/20">
              <span className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-soft-gray">
                {cat}
                <span className="ml-2 normal-case font-crimson text-xs text-soft-gray/60">
                  {catTasks.filter(t => t.status === 'done').length}/{catTasks.length}
                </span>
              </span>
              <button
                onClick={() => onAdd(cat)}
                className="font-work-sans text-[9px] uppercase tracking-wide text-soft-gray/50 hover:text-gold-line transition-colors"
              >
                + add
              </button>
            </div>
            {catTasks.map(task => (
              <TaskRow key={task.id} task={task} allCategories={allCategories} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
        ))
        : (
          <div>
            {filteredTasks.map(task => (
              <TaskRow key={task.id} task={task} allCategories={allCategories} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
        )
      }
    </section>
  )
}

// ── Budget section ─────────────────────────────────────────────────────────────

function BudgetSection({
  items, scenarios,
  onUpdateItem, onDeleteItem, onAddItem,
  onUpdateScenario, onDeleteScenario, onAddScenario,
}: {
  items: BudgetItem[]
  scenarios: GuestScenario[]
  onUpdateItem: (id: string, patch: Partial<BudgetItem>) => void
  onDeleteItem: (id: string) => void
  onAddItem: (paid: boolean) => void
  onUpdateScenario: (id: string, patch: Partial<GuestScenario>) => void
  onDeleteScenario: (id: string) => void
  onAddScenario: () => void
}) {
  const paidItems = items.filter(i => i.paid)
  const pendingItems = items.filter(i => !i.paid)

  return (
    <section>
      <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line mb-5">
        Budget Tracker
      </h2>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {/* Paid column */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-line inline-block" />
              Already Paid
            </h3>
            <button onClick={() => onAddItem(true)} className="font-work-sans text-[9px] tracking-[0.1em] uppercase text-soft-gray/60 hover:text-gold-line transition-colors">
              + add
            </button>
          </div>
          <div className="border border-soft-gray/20 rounded overflow-hidden">
            {paidItems.map((item, i) => (
              <div key={item.id} className={`flex items-center gap-2 px-3 py-2.5 group/bi ${i % 2 === 0 ? 'bg-ivory' : 'bg-warm-cream'}`}>
                <EditableText
                  value={item.item}
                  onChange={v => onUpdateItem(item.id, { item: v })}
                  className="font-crimson text-sm text-dark-taupe flex-1 min-w-0"
                />
                <EditableText
                  value={item.cost}
                  onChange={v => onUpdateItem(item.id, { cost: v })}
                  className="font-crimson text-sm text-deep-ivory text-right flex-shrink-0"
                />
                <button
                  onClick={() => onUpdateItem(item.id, { paid: false })}
                  className="text-gold-line hover:text-soft-gray transition-colors flex-shrink-0 text-xs w-5 h-5 flex items-center justify-center"
                  title="Move to pending"
                >
                  ✓
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-soft-gray/25 hover:text-muted-rose transition-colors text-base flex-shrink-0 w-5 h-5 flex items-center justify-center opacity-0 group-hover/bi:opacity-100"
                  aria-label="Delete item"
                >
                  ×
                </button>
              </div>
            ))}
            {paidItems.length === 0 && (
              <p className="font-crimson italic text-sm text-soft-gray/50 px-3 py-3">No paid items.</p>
            )}
          </div>
        </div>

        {/* Pending column */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-rose inline-block" />
              Pending Payment
            </h3>
            <button onClick={() => onAddItem(false)} className="font-work-sans text-[9px] tracking-[0.1em] uppercase text-soft-gray/60 hover:text-gold-line transition-colors">
              + add
            </button>
          </div>
          <div className="border border-soft-gray/20 rounded overflow-hidden">
            {pendingItems.map((item, i) => (
              <div key={item.id} className={`flex items-center gap-2 px-3 py-2.5 group/bi ${i % 2 === 0 ? 'bg-ivory' : 'bg-warm-cream'}`}>
                <EditableText
                  value={item.item}
                  onChange={v => onUpdateItem(item.id, { item: v })}
                  className="font-crimson text-sm text-dark-taupe flex-1 min-w-0"
                />
                <EditableText
                  value={item.cost}
                  onChange={v => onUpdateItem(item.id, { cost: v })}
                  className="font-crimson text-sm text-deep-ivory text-right flex-shrink-0"
                />
                <button
                  onClick={() => onUpdateItem(item.id, { paid: true })}
                  className="text-soft-gray/40 hover:text-gold-line transition-colors flex-shrink-0 text-xs w-5 h-5 flex items-center justify-center"
                  title="Mark as paid"
                >
                  ○
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-soft-gray/25 hover:text-muted-rose transition-colors text-base flex-shrink-0 w-5 h-5 flex items-center justify-center opacity-0 group-hover/bi:opacity-100"
                  aria-label="Delete item"
                >
                  ×
                </button>
              </div>
            ))}
            {pendingItems.length === 0 && (
              <p className="font-crimson italic text-sm text-soft-gray/50 px-3 py-3">No pending items.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reception scenarios */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory">
            Reception Cost Scenarios
          </h3>
          <button
            onClick={onAddScenario}
            className="font-work-sans text-[9px] tracking-[0.1em] uppercase text-soft-gray/60 hover:text-gold-line transition-colors"
          >
            + add
          </button>
        </div>
        <p className="font-crimson italic text-xs text-soft-gray/60 mb-3">
          Tap any number to edit. Total auto-calculates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map(sc => {
            const numTables = Math.ceil(sc.numGuests / sc.seatsPerTable)
            const total = numTables * sc.costPerTable
            return (
              <div key={sc.id} className="border border-soft-gray/20 rounded-lg px-4 py-3 bg-warm-cream group/sc relative">
                <button
                  onClick={() => onDeleteScenario(sc.id)}
                  className="absolute top-2 right-2 text-soft-gray/25 hover:text-muted-rose transition-colors text-base w-5 h-5 flex items-center justify-center opacity-0 group-hover/sc:opacity-100"
                  aria-label="Delete scenario"
                >
                  ×
                </button>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <EditableNumber
                    value={sc.numGuests}
                    onChange={v => onUpdateScenario(sc.id, { numGuests: v })}
                    className="font-crimson text-2xl text-dark-taupe"
                  />
                  <span className="font-crimson text-base text-deep-ivory">guests</span>
                </div>

                <p className="font-crimson text-sm text-deep-ivory mb-1.5">
                  {numTables} tables · <span className="text-dark-taupe font-semibold">${total.toLocaleString()}</span> total
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1 font-work-sans text-[9px] tracking-wide uppercase text-soft-gray">
                    <span>$</span>
                    <EditableNumber
                      value={sc.costPerTable}
                      onChange={v => onUpdateScenario(sc.id, { costPerTable: v })}
                      className="font-work-sans text-[9px] uppercase text-soft-gray"
                    />
                    <span>/table</span>
                  </div>
                  <div className="flex items-center gap-1 font-work-sans text-[9px] tracking-wide uppercase text-soft-gray">
                    <EditableNumber
                      value={sc.seatsPerTable}
                      onChange={v => onUpdateScenario(sc.id, { seatsPerTable: v })}
                      className="font-work-sans text-[9px] uppercase text-soft-gray"
                    />
                    <span>seats/table</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Vendor status config ───────────────────────────────────────────────────────

const VENDOR_STATUS_PILL: Record<VendorStatus, string> = {
  confirmed:      'bg-gold-line/20 text-deep-ivory border border-gold-line/40',
  'deposit-paid': 'bg-pale-gold/30 text-deep-ivory border border-pale-gold/60',
  pending:        'bg-soft-gray/20 text-soft-gray border border-soft-gray/40',
  'in-discussion':'bg-lilac/20 text-dusty-lilac border border-lilac/40',
}

const VENDOR_STATUS_OPTIONS: { value: VendorStatus; label: string }[] = [
  { value: 'confirmed',      label: 'Confirmed' },
  { value: 'deposit-paid',   label: 'Deposit Paid' },
  { value: 'pending',        label: 'Pending' },
  { value: 'in-discussion',  label: 'In Discussion' },
]

// ── Vendors section ────────────────────────────────────────────────────────────

function VendorField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mb-0.5">{label}</p>
      {children}
    </div>
  )
}

function VendorsSection({
  vendors, onUpdate, onDelete, onAdd,
}: {
  vendors: Vendor[]
  onUpdate: (id: string, patch: Partial<Vendor>) => void
  onDelete: (id: string) => void
  onAdd: () => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories = Array.from(new Set(vendors.map(v => v.category))).sort()

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
          Vendor Contacts
        </h2>
        <button
          onClick={onAdd}
          className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray hover:text-gold-line transition-colors"
        >
          + Add Vendor
        </button>
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-6">
          <p className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-soft-gray mb-2 pb-1 border-b border-soft-gray/20">
            {cat}
          </p>
          <div className="flex flex-col gap-2">
            {vendors.filter(v => v.category === cat).map(v => {
              const isExpanded = expandedId === v.id
              const statusLabel = VENDOR_STATUS_OPTIONS.find(o => o.value === v.status)?.label ?? v.status
              return (
                <div key={v.id} className="border border-soft-gray/20 rounded-lg bg-warm-cream group/vendor overflow-hidden">
                  {/* Summary row */}
                  <div className="flex items-center gap-2 px-4 py-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                      className="flex-1 min-w-0 flex items-center gap-2 text-left"
                      aria-expanded={isExpanded}
                    >
                      <span className="font-crimson text-base font-semibold text-dark-taupe truncate">
                        {v.vendor || 'New Vendor'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-work-sans tracking-wider uppercase flex-shrink-0 ${VENDOR_STATUS_PILL[v.status]}`}>
                        {statusLabel}
                      </span>
                    </button>
                    <span className="font-crimson text-sm text-deep-ivory flex-shrink-0 hidden sm:block">
                      {v.budget}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                      className="text-soft-gray/40 hover:text-deep-ivory transition-colors w-7 h-7 flex items-center justify-center text-[10px] flex-shrink-0"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                    <button
                      onClick={() => onDelete(v.id)}
                      className="text-soft-gray/25 hover:text-muted-rose transition-colors text-base w-7 h-7 flex items-center justify-center flex-shrink-0 opacity-0 group-hover/vendor:opacity-100"
                      aria-label="Delete vendor"
                    >
                      ×
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-soft-gray/15 px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <VendorField label="Name">
                        <EditableText value={v.vendor} onChange={val => onUpdate(v.id, { vendor: val })} className="font-crimson text-sm text-dark-taupe" />
                      </VendorField>
                      <VendorField label="Service">
                        <EditableText value={v.service} onChange={val => onUpdate(v.id, { service: val })} className="font-crimson text-sm text-dark-taupe" placeholder="service description…" />
                      </VendorField>
                      <VendorField label="Category">
                        <EditableText value={v.category} onChange={val => onUpdate(v.id, { category: val || v.category })} className="font-crimson text-sm text-dark-taupe" placeholder="e.g. Music, Venue…" />
                      </VendorField>
                      <VendorField label="Status">
                        <select
                          value={v.status}
                          onChange={e => onUpdate(v.id, { status: e.target.value as VendorStatus })}
                          className="font-crimson text-sm text-dark-taupe bg-transparent border-b border-gold-line/30 focus:border-gold-line outline-none py-0.5"
                        >
                          {VENDOR_STATUS_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </VendorField>
                      <VendorField label="Budget">
                        <EditableText value={v.budget} onChange={val => onUpdate(v.id, { budget: val })} className="font-crimson text-sm text-dark-taupe" placeholder="$0" />
                      </VendorField>
                      <VendorField label="Contact Name">
                        <EditableText value={v.contact} onChange={val => onUpdate(v.id, { contact: val })} className="font-crimson text-sm text-dark-taupe" placeholder="contact name…" />
                      </VendorField>
                      <VendorField label="Phone">
                        <EditableText value={v.phone} onChange={val => onUpdate(v.id, { phone: val })} className="font-crimson text-sm text-dark-taupe" placeholder="add phone…" />
                      </VendorField>
                      <VendorField label="Email">
                        <EditableText value={v.email} onChange={val => onUpdate(v.id, { email: val })} className="font-crimson text-sm text-dark-taupe" placeholder="add email…" />
                      </VendorField>
                      <div className="sm:col-span-2">
                        <VendorField label="Notes">
                          <EditableText value={v.notes} onChange={val => onUpdate(v.id, { notes: val })} className="font-crimson text-sm text-dark-taupe" placeholder="add notes…" />
                        </VendorField>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <p className="font-crimson italic text-sm text-soft-gray text-center py-8">No vendors yet.</p>
      )}
    </section>
  )
}

// ── Main dashboard ─────────────────────────────────────────────────────────────

export default function PlannerDashboard() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_ITEMS)
  const [scenarios, setScenarios] = useState<GuestScenario[]>(INITIAL_SCENARIOS)
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS)
  const [activeSection, setActiveSection] = useState<'timeline' | 'tasks' | 'budget' | 'vendors'>('timeline')

  // Deadline handlers
  const updateDeadline = (id: string, patch: Partial<Deadline>) =>
    setDeadlines(p => p.map(d => d.id === id ? { ...d, ...patch } : d))
  const deleteDeadline = (id: string) =>
    setDeadlines(p => p.filter(d => d.id !== id))
  const addDeadline = () =>
    setDeadlines(p => [...p, { id: uid(), date: 'New Date', label: 'UPCOMING', urgency: 'upcoming', title: 'New Milestone', bullets: [{ id: uid(), text: 'Add details here' }] }])
  const addBullet = (dlId: string) =>
    setDeadlines(p => p.map(d => d.id === dlId ? { ...d, bullets: [...d.bullets, { id: uid(), text: 'New item' }] } : d))
  const updateBullet = (dlId: string, bId: string, text: string) =>
    setDeadlines(p => p.map(d => d.id === dlId ? { ...d, bullets: d.bullets.map(b => b.id === bId ? { ...b, text } : b) } : d))
  const deleteBullet = (dlId: string, bId: string) =>
    setDeadlines(p => p.map(d => d.id === dlId ? { ...d, bullets: d.bullets.filter(b => b.id !== bId) } : d))

  // Task handlers
  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks(p => p.map(t => t.id === id ? { ...t, ...patch } : t))
  const deleteTask = (id: string) =>
    setTasks(p => p.filter(t => t.id !== id))
  const addTask = (category?: string) =>
    setTasks(p => [...p, { id: uid(), title: 'New task', category: category ?? 'Other', status: 'pending', assignee: '', dueLabel: '', notes: '' }])

  // Budget handlers
  const updateBudgetItem = (id: string, patch: Partial<BudgetItem>) =>
    setBudgetItems(p => p.map(i => i.id === id ? { ...i, ...patch } : i))
  const deleteBudgetItem = (id: string) =>
    setBudgetItems(p => p.filter(i => i.id !== id))
  const addBudgetItem = (paid: boolean) =>
    setBudgetItems(p => [...p, { id: uid(), item: 'New item', cost: '$0', paid }])

  // Scenario handlers
  const updateScenario = (id: string, patch: Partial<GuestScenario>) =>
    setScenarios(p => p.map(s => s.id === id ? { ...s, ...patch } : s))
  const deleteScenario = (id: string) =>
    setScenarios(p => p.filter(s => s.id !== id))
  const addScenario = () =>
    setScenarios(p => [...p, { id: uid(), numGuests: 100, costPerTable: 1600, seatsPerTable: 8 }])

  // Vendor handlers
  const updateVendor = (id: string, patch: Partial<Vendor>) =>
    setVendors(p => p.map(v => v.id === id ? { ...v, ...patch } : v))
  const deleteVendor = (id: string) =>
    setVendors(p => p.filter(v => v.id !== id))
  const addVendor = () =>
    setVendors(p => [...p, { id: uid(), vendor: 'New Vendor', service: '', category: 'Other', contact: '', phone: '', email: '', budget: '', status: 'pending', notes: '' }])

  const handleLogout = async () => {
    await fetch('/api/planner-auth/logout', { method: 'POST' }).catch(() => {})
    document.cookie = 'planner-auth=; Max-Age=0; path=/'
    window.location.replace('/planner/login')
  }

  const doneTasks = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const pending = tasks.filter(t => t.status === 'pending').length

  const navItems: { key: typeof activeSection; label: string }[] = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'tasks',    label: 'Tasks' },
    { key: 'budget',   label: 'Budget' },
    { key: 'vendors',  label: 'Vendors' },
  ]

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-ivory/95 backdrop-blur-sm border-b border-soft-gray/30 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto h-14 flex items-center justify-between gap-3">
          <span className="font-italiana text-lg sm:text-xl text-dark-taupe tracking-wide leading-none flex-shrink-0">
            Christine &amp; Michael
          </span>

          {/* Nav — scrollable on small screens */}
          <nav className="flex items-center overflow-x-auto gap-0.5 flex-1 justify-center">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`font-work-sans text-[9px] tracking-[0.2em] uppercase px-2.5 sm:px-3 py-2 whitespace-nowrap transition-colors min-h-[44px] border-b-2 ${
                  activeSection === key
                    ? 'text-dark-taupe border-gold-line'
                    : 'text-soft-gray hover:text-deep-ivory border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray hover:text-muted-rose transition-colors flex-shrink-0 min-h-[44px] flex items-center"
          >
            Exit
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Total',       value: tasks.length, color: 'text-dark-taupe' },
            { label: 'Done',        value: doneTasks,    color: 'text-deep-ivory' },
            { label: 'In Progress', value: inProgress,   color: 'text-dusty-lilac' },
            { label: 'Pending',     value: pending,      color: 'text-soft-gray' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-warm-cream border border-soft-gray/20 rounded px-3 py-2.5">
              <p className={`font-crimson text-2xl sm:text-3xl ${color} leading-none mb-0.5`}>{value}</p>
              <p className="font-work-sans text-[8px] tracking-[0.2em] uppercase text-soft-gray">{label}</p>
            </div>
          ))}
        </div>

        {/* Active section */}
        {activeSection === 'timeline' && (
          <TimelineSection
            deadlines={deadlines}
            onUpdate={updateDeadline}
            onDelete={deleteDeadline}
            onAdd={addDeadline}
            onAddBullet={addBullet}
            onUpdateBullet={updateBullet}
            onDeleteBullet={deleteBullet}
          />
        )}
        {activeSection === 'tasks' && (
          <TasksSection
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onAdd={addTask}
          />
        )}
        {activeSection === 'budget' && (
          <BudgetSection
            items={budgetItems}
            scenarios={scenarios}
            onUpdateItem={updateBudgetItem}
            onDeleteItem={deleteBudgetItem}
            onAddItem={addBudgetItem}
            onUpdateScenario={updateScenario}
            onDeleteScenario={deleteScenario}
            onAddScenario={addScenario}
          />
        )}
        {activeSection === 'vendors' && (
          <VendorsSection
            vendors={vendors}
            onUpdate={updateVendor}
            onDelete={deleteVendor}
            onAdd={addVendor}
          />
        )}

        <div className="mt-10 pt-5 border-t border-soft-gray/20 text-center">
          <p className="font-work-sans text-[8px] tracking-[0.25em] uppercase text-soft-gray/40">
            Christine &amp; Michael · September 12, 2026 · Planning Portal
          </p>
        </div>
      </div>
    </div>
  )
}
