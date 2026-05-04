'use client'

import { useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type TaskStatus = 'done' | 'in-progress' | 'pending'

type Task = {
  id: string
  title: string
  category: string
  status: TaskStatus
  assignee: string
  dueLabel?: string
  notes?: string
}

type DeadlineUrgency = 'wedding' | 'critical' | 'soon' | 'upcoming'

type Deadline = {
  date: string
  label: string
  title: string
  bullets: string[]
  urgency: DeadlineUrgency
}

type BudgetItem = {
  item: string
  cost: string
  status: 'paid' | 'pending'
}

type Vendor = {
  vendor: string
  service: string
  contact: string
  budget: string
  status: 'confirmed' | 'deposit-paid' | 'pending' | 'in-discussion'
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const DEADLINES: Deadline[] = [
  {
    date: 'May 5, 2026',
    label: 'TOMORROW',
    title: 'Wedding Planner Call',
    bullets: [
      'Discuss small decoration coordination',
      'Day-of table setup & guest check-in logistics',
      'Confirm: decoration setup and day-of coordination',
      'Status update: guest count (100–120), vendor confirmations, timeline review',
    ],
    urgency: 'critical',
  },
  {
    date: 'June 12, 2026',
    label: '⏰ CRITICAL',
    title: 'Send RSVPs & Confirm Golden Unicorn',
    bullets: [
      'Send formal invitations to all guests',
      'RSVP deadline: ~July 15 (6 weeks before wedding)',
      'Confirm final menu selection with Golden Unicorn',
      'Confirm final guest count accommodation',
      'Discuss any dietary restrictions',
    ],
    urgency: 'critical',
  },
  {
    date: 'August 15, 2026',
    label: '⏰ CRITICAL',
    title: 'Get Items Printed',
    bullets: [
      'Table number frames',
      'Ceremony programs',
      'Place cards / seating cards',
      'Guest list for check-in table',
      'Menu cards (optional)',
      'Allow 2–3 weeks for printing and delivery',
    ],
    urgency: 'soon',
  },
  {
    date: 'August 22, 2026',
    label: '⏰ CRITICAL',
    title: 'Finalize Table Arrangements & Seating Chart',
    bullets: [
      'Complete final table layout and seating assignments',
      'Coordinate with reception venue on setup preferences',
      'Finalize any last-minute guest changes',
      'Create table numbers and place cards',
    ],
    urgency: 'soon',
  },
  {
    date: 'September 10, 2026',
    label: '⏰ CRITICAL',
    title: 'Prepare All Ceremony Flowers (2 Days Before)',
    bullets: [
      'Make bridal bouquet',
      'Prepare flower girl rose basket',
      'Any altar or ceremony arch arrangements',
      'Ensure flower freshness',
    ],
    urgency: 'upcoming',
  },
  {
    date: 'September 12, 2026',
    label: '🎊 WEDDING DAY',
    title: 'Christine & Michael\'s Wedding',
    bullets: [
      "Ceremony: 2:00 PM at St. Joseph's Church, Greenwich Village",
      'Reception setup: arrive 4:00 PM at Golden Unicorn',
      'Reception: 5:00 PM – 10:00 PM at Golden Unicorn',
    ],
    urgency: 'wedding',
  },
]

const INITIAL_TASKS: Task[] = [
  // DIY Floral Projects
  { id: 't1',  title: 'Make bridal bouquet',                           category: 'DIY Florals',         status: 'pending',     assignee: '',            dueLabel: 'Sep 10' },
  { id: 't2',  title: 'Prepare flower girl basket with roses',         category: 'DIY Florals',         status: 'pending',     assignee: '',            dueLabel: 'Sep 10' },
  { id: 't3',  title: 'Source vases for floral arrangements',          category: 'DIY Florals',         status: 'pending',     assignee: '' },

  // Vendor Confirmations
  { id: 't4',  title: 'Confirm final details with Jin Krista (music)', category: 'Vendors',             status: 'pending',     assignee: '',            dueLabel: 'Jun 12' },
  { id: 't5',  title: 'Finalize photographer booking (6 hrs or 8 hrs?)',category: 'Vendors',            status: 'pending',     assignee: '' },
  { id: 't6',  title: 'Confirm DJ details and music preferences',      category: 'Vendors',             status: 'pending',     assignee: '' },
  { id: 't7',  title: 'Coordinate with florist for ceremony arch & centerpieces', category: 'Vendors', status: 'pending',     assignee: '' },
  { id: 't8',  title: 'Confirm lion dancers logistics and timing',     category: 'Vendors',             status: 'pending',     assignee: '' },

  // Guest Planning
  { id: 't9',  title: 'Finalize guest count (100 or 120 guests?)',     category: 'Guests',              status: 'in-progress', assignee: '',            dueLabel: 'Jun 12' },
  { id: 't10', title: 'Send out formal invitations',                   category: 'Guests',              status: 'pending',     assignee: '',            dueLabel: 'Jun 12' },
  { id: 't11', title: 'Collect RSVPs',                                 category: 'Guests',              status: 'pending',     assignee: '',            dueLabel: 'Jul 15' },

  // Ceremony Details
  { id: 't12', title: 'Finalize ceremony music selections with Jin Krista', category: 'Ceremony',      status: 'pending',     assignee: '' },
  { id: 't13', title: 'Coordinate with St. Joseph\'s Church on timing',category: 'Ceremony',           status: 'pending',     assignee: '' },
  { id: 't14', title: 'Plan processional and recessional order',       category: 'Ceremony',            status: 'pending',     assignee: '' },

  // Reception Planning
  { id: 't15', title: 'Confirm final menu with Golden Unicorn',        category: 'Reception',           status: 'pending',     assignee: '',            dueLabel: 'Jun 12' },
  { id: 't16', title: 'Plan table layout and seating chart',           category: 'Reception',           status: 'pending',     assignee: '',            dueLabel: 'Aug 22' },
  { id: 't17', title: 'Arrange transportation if needed',              category: 'Reception',           status: 'pending',     assignee: '' },

  // Design & Style
  { id: 't18', title: 'Source materials for bridal bouquet',           category: 'Design & Style',      status: 'pending',     assignee: '' },
  { id: 't19', title: 'Source roses for flower girl basket',           category: 'Design & Style',      status: 'pending',     assignee: '' },
  { id: 't20', title: 'Plan bridesmaid attire (ivory/blush/lilac)',    category: 'Design & Style',      status: 'pending',     assignee: '' },
  { id: 't21', title: 'Finalize groomsmen attire',                     category: 'Design & Style',      status: 'pending',     assignee: '' },

  // Printing & Materials
  { id: 't22', title: 'Order table number frames',                     category: 'Printing',            status: 'pending',     assignee: '',            dueLabel: 'Aug 15' },
  { id: 't23', title: 'Order ceremony programs',                       category: 'Printing',            status: 'pending',     assignee: '',            dueLabel: 'Aug 15' },
  { id: 't24', title: 'Order seating cards / place cards',             category: 'Printing',            status: 'pending',     assignee: '',            dueLabel: 'Aug 15' },
  { id: 't25', title: 'Order guest list for check-in table',           category: 'Printing',            status: 'pending',     assignee: '',            dueLabel: 'Aug 15' },
  { id: 't26', title: 'Order menu cards (optional)',                   category: 'Printing',            status: 'pending',     assignee: '',            dueLabel: 'Aug 15' },

  // Other
  { id: 't27', title: 'Complete marriage prep class',                  category: 'Other',               status: 'in-progress', assignee: 'Christine & Michael', dueLabel: 'Sep 12' },
  { id: 't28', title: 'Wedding dress final fittings',                  category: 'Other',               status: 'pending',     assignee: 'Christine' },
  { id: 't29', title: 'Plan rehearsal dinner details',                 category: 'Other',               status: 'pending',     assignee: '' },
  { id: 't30', title: 'Arrange wedding day timeline and schedule',     category: 'Other',               status: 'pending',     assignee: '' },
]

const PAID_ITEMS: BudgetItem[] = [
  { item: 'Marriage class',        cost: '$195',   status: 'paid' },
  { item: 'Wedding dress',         cost: '$3,380', status: 'paid' },
  { item: 'Website',               cost: '$100',   status: 'paid' },
  { item: 'Church ceremony fee',   cost: '$2,500', status: 'paid' },
  { item: 'Reception deposit',     cost: '$500',   status: 'paid' },
  { item: 'Save the Date',         cost: '$0',     status: 'paid' },
]

const PENDING_ITEMS: BudgetItem[] = [
  { item: 'Marriage prep class',          cost: '$200',             status: 'pending' },
  { item: 'Reception (remaining balance)',cost: '$20,300–$23,500',  status: 'pending' },
  { item: 'Photography (6 hrs)',          cost: '$3,000',           status: 'pending' },
  { item: 'DJ',                           cost: '$3,000',           status: 'pending' },
  { item: 'Florals',                      cost: '$3,000',           status: 'pending' },
  { item: 'Lion dancers',                 cost: '$1,000',           status: 'pending' },
  { item: 'Ceremony music – Jin Krista',  cost: '$2,000',           status: 'pending' },
]

const VENDORS: Vendor[] = [
  { vendor: 'Jin Krista',         service: 'Ceremony Music',         contact: 'TBD',  budget: '$2,000',           status: 'confirmed' },
  { vendor: 'Golden Unicorn',     service: 'Reception Venue',        contact: 'TBD',  budget: '$20,800–$24,000',  status: 'deposit-paid' },
  { vendor: 'Photographer',       service: 'Photography (6–8 hrs)',  contact: 'TBD',  budget: '$3,000–$4,000',    status: 'pending' },
  { vendor: 'DJ',                 service: 'Reception Entertainment',contact: 'TBD',  budget: '$3,000',           status: 'pending' },
  { vendor: 'Florist',            service: 'Florals & Arrangements', contact: 'TBD',  budget: '$3,000',           status: 'pending' },
  { vendor: 'Lion Dancers',       service: 'Cultural Entertainment', contact: 'TBD',  budget: '$1,000',           status: 'pending' },
  { vendor: 'St. Joseph\'s Church',service: 'Ceremony Venue',        contact: 'TBD',  budget: '$2,500 (paid)',     status: 'confirmed' },
  { vendor: 'Wedding Planner',    service: 'Overall Coordination',   contact: 'TBD',  budget: 'TBD',             status: 'in-discussion' },
]

const CATEGORIES = ['All', 'DIY Florals', 'Vendors', 'Guests', 'Ceremony', 'Reception', 'Design & Style', 'Printing', 'Other']

// ── Helpers ───────────────────────────────────────────────────────────────────

const urgencyStyles: Record<DeadlineUrgency, { dot: string; card: string; label: string }> = {
  wedding:  { dot: 'bg-lilac',      card: 'border-lilac bg-lilac/10',       label: 'text-dusty-lilac font-semibold' },
  critical: { dot: 'bg-muted-rose', card: 'border-muted-rose bg-muted-rose/10', label: 'text-muted-rose font-semibold' },
  soon:     { dot: 'bg-gold-line',  card: 'border-gold-line bg-pale-gold/20',  label: 'text-deep-ivory' },
  upcoming: { dot: 'bg-pale-gold',  card: 'border-pale-gold bg-ivory',       label: 'text-soft-gray' },
}

const statusStyles: Record<TaskStatus, { pill: string; label: string }> = {
  done:        { pill: 'bg-gold-line/20 text-deep-ivory border border-gold-line/40',   label: 'Done' },
  'in-progress': { pill: 'bg-lilac/20 text-dusty-lilac border border-lilac/40',        label: 'In Progress' },
  pending:     { pill: 'bg-soft-gray/20 text-soft-gray border border-soft-gray/40',    label: 'Pending' },
}

const vendorStatusStyles: Record<Vendor['status'], string> = {
  'confirmed':     'bg-gold-line/20 text-deep-ivory border border-gold-line/40',
  'deposit-paid':  'bg-pale-gold/30 text-deep-ivory border border-pale-gold/60',
  'pending':       'bg-soft-gray/20 text-soft-gray border border-soft-gray/40',
  'in-discussion': 'bg-lilac/20 text-dusty-lilac border border-lilac/40',
}

const vendorStatusLabel: Record<Vendor['status'], string> = {
  'confirmed':     'Confirmed',
  'deposit-paid':  'Deposit Paid',
  'pending':       'Pending',
  'in-discussion': 'In Discussion',
}

const nextStatus: Record<TaskStatus, TaskStatus> = {
  pending: 'in-progress',
  'in-progress': 'done',
  done: 'pending',
}

// ── Components ────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: TaskStatus }) {
  const s = statusStyles[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-work-sans tracking-wider uppercase whitespace-nowrap ${s.pill}`}>
      {s.label}
    </span>
  )
}

function TaskRow({
  task,
  onStatusChange,
  onAssigneeChange,
}: {
  task: Task
  onStatusChange: (id: string, status: TaskStatus) => void
  onAssigneeChange: (id: string, assignee: string) => void
}) {
  const [editingAssignee, setEditingAssignee] = useState(false)
  const [assigneeInput, setAssigneeInput] = useState(task.assignee)

  const handleAssigneeBlur = () => {
    setEditingAssignee(false)
    onAssigneeChange(task.id, assigneeInput)
  }

  return (
    <div className={`flex items-start gap-3 py-3 border-b border-soft-gray/20 last:border-0 ${task.status === 'done' ? 'opacity-60' : ''}`}>
      {/* Status toggle button */}
      <button
        onClick={() => onStatusChange(task.id, nextStatus[task.status])}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border border-gold-line/50 flex items-center justify-center hover:border-gold-line transition-colors"
        title={`Mark as ${nextStatus[task.status]}`}
        aria-label={`Toggle status: currently ${task.status}`}
      >
        {task.status === 'done' && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
            <path d="M1 4L4 7L10 1" stroke="#C3AF82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {task.status === 'in-progress' && (
          <div className="w-2 h-2 rounded-full bg-dusty-lilac" />
        )}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <p className={`font-crimson text-sm text-dark-taupe leading-snug ${task.status === 'done' ? 'line-through' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
          <StatusPill status={task.status} />
          {task.dueLabel && (
            <span className="font-work-sans text-[9px] tracking-wider uppercase text-muted-rose/80">
              Due {task.dueLabel}
            </span>
          )}
          {editingAssignee ? (
            <input
              autoFocus
              value={assigneeInput}
              onChange={e => setAssigneeInput(e.target.value)}
              onBlur={handleAssigneeBlur}
              onKeyDown={e => { if (e.key === 'Enter') handleAssigneeBlur() }}
              placeholder="assign to…"
              className="font-work-sans text-[10px] tracking-wide text-deep-ivory bg-transparent border-b border-gold-line/50 focus:border-gold-line outline-none w-28 pb-0.5"
            />
          ) : (
            <button
              onClick={() => setEditingAssignee(true)}
              className="font-work-sans text-[10px] tracking-wide text-deep-ivory/60 hover:text-gold-line transition-colors"
            >
              {task.assignee ? `→ ${task.assignee}` : '+ assign'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PlannerDashboard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSection, setActiveSection] = useState<'timeline' | 'tasks' | 'budget' | 'vendors'>('timeline')

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const handleAssigneeChange = (id: string, assignee: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignee } : t))
  }

  const handleLogout = async () => {
    await fetch('/api/planner-auth/logout', { method: 'POST' }).catch(() => {})
    document.cookie = 'planner-auth=; Max-Age=0; path=/'
    window.location.replace('/planner/login')
  }

  const filteredTasks = activeCategory === 'All'
    ? tasks
    : tasks.filter(t => t.category === activeCategory)

  const groupedTasks = CATEGORIES.slice(1).reduce<Record<string, Task[]>>((acc, cat) => {
    const catTasks = tasks.filter(t => t.category === cat)
    if (catTasks.length) acc[cat] = catTasks
    return acc
  }, {})

  const doneTasks = tasks.filter(t => t.status === 'done').length
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length

  const paidTotal = 7375
  const pendingMin = 32500
  const pendingMax = 35700

  const navItems: { key: typeof activeSection; label: string }[] = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'tasks',    label: 'Tasks' },
    { key: 'budget',   label: 'Budget' },
    { key: 'vendors',  label: 'Vendors' },
  ]

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Top bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-ivory border-b border-soft-gray/30 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-italiana text-xl text-dark-taupe tracking-wide leading-none">
              C &amp; M
            </span>
            <span className="hidden sm:block font-work-sans text-[9px] tracking-[0.3em] uppercase text-soft-gray">
              Wedding Coordination
            </span>
          </div>

          {/* Section nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`
                  font-work-sans text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 transition-colors
                  ${activeSection === key
                    ? 'text-dark-taupe border-b-2 border-gold-line'
                    : 'text-soft-gray hover:text-deep-ivory'}
                `}
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray hover:text-muted-rose transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {/* ── Stats row ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Tasks', value: tasks.length, color: 'text-dark-taupe' },
            { label: 'Done',        value: doneTasks,    color: 'text-deep-ivory' },
            { label: 'In Progress', value: inProgressTasks, color: 'text-dusty-lilac' },
            { label: 'Pending',     value: pendingTasks, color: 'text-soft-gray' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-3">
              <p className={`font-italiana text-3xl ${color} leading-none mb-1`}>{value}</p>
              <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Timeline ──────────────────────────────────────── */}
        {activeSection === 'timeline' && (
          <section>
            <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line mb-6">
              Critical Deadlines
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-soft-gray/30" />

              <div className="flex flex-col gap-6 pl-10">
                {DEADLINES.map((dl) => {
                  const s = urgencyStyles[dl.urgency]
                  return (
                    <div key={dl.date} className="relative">
                      {/* Dot */}
                      <div className={`absolute -left-7 top-1.5 w-3 h-3 rounded-full ${s.dot} ring-2 ring-ivory`} />

                      <div className={`border rounded-lg p-4 ${s.card}`}>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-2">
                          <span className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray">
                            {dl.date}
                          </span>
                          <span className={`font-work-sans text-[10px] tracking-[0.2em] uppercase ${s.label}`}>
                            {dl.label}
                          </span>
                        </div>
                        <h3 className="font-italiana text-lg text-dark-taupe mb-2 leading-snug">
                          {dl.title}
                        </h3>
                        <ul className="space-y-1">
                          {dl.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-gold-line mt-1 flex-shrink-0 text-xs">·</span>
                              <span className="font-crimson text-sm text-deep-ivory leading-snug">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Tasks ─────────────────────────────────────────── */}
        {activeSection === 'tasks' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
                Task Board
              </h2>
              <p className="font-lora italic text-xs text-soft-gray">
                Click the circle to cycle status · click "assign" to set a name
              </p>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    font-work-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 border rounded-full transition-colors
                    ${activeCategory === cat
                      ? 'bg-dark-taupe text-ivory border-dark-taupe'
                      : 'bg-transparent text-deep-ivory border-soft-gray/40 hover:border-gold-line hover:text-dark-taupe'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Task list */}
            {activeCategory === 'All' ? (
              Object.entries(groupedTasks).map(([cat, catTasks]) => (
                <div key={cat} className="mb-6">
                  <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-soft-gray mb-2 pb-1 border-b border-soft-gray/20">
                    {cat}
                    <span className="ml-2 normal-case font-crimson text-xs">
                      {catTasks.filter(t => t.status === 'done').length}/{catTasks.length}
                    </span>
                  </h3>
                  {catTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onAssigneeChange={handleAssigneeChange}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div>
                {filteredTasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onAssigneeChange={handleAssigneeChange}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Budget ────────────────────────────────────────── */}
        {activeSection === 'budget' && (
          <section>
            <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line mb-6">
              Budget Tracker
            </h2>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-4 text-center">
                <p className="font-italiana text-2xl text-deep-ivory">$7,375</p>
                <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mt-1">Total Paid</p>
              </div>
              <div className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-4 text-center">
                <p className="font-italiana text-2xl text-muted-rose">${pendingMin.toLocaleString()}+</p>
                <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mt-1">Remaining to Pay</p>
              </div>
              <div className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-4 text-center">
                <p className="font-italiana text-2xl text-dark-taupe">$35K–$37K</p>
                <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mt-1">Estimated Total</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-1">
                <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">Budget paid</span>
                <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-deep-ivory">
                  {Math.round(paidTotal / 36175 * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-soft-gray/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-line rounded-full"
                  style={{ width: `${Math.round(paidTotal / 36175 * 100)}%` }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Paid */}
              <div>
                <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-line inline-block" />
                  Already Paid
                </h3>
                <div className="border border-soft-gray/20 rounded overflow-hidden">
                  {PAID_ITEMS.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 === 0 ? 'bg-ivory' : 'bg-warm-cream'}`}>
                      <span className="font-crimson text-sm text-dark-taupe">{item.item}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-crimson text-sm text-deep-ivory">{item.cost}</span>
                        <span className="text-gold-line text-xs">✓</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-pale-gold/20 border-t border-soft-gray/20">
                    <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-deep-ivory">Subtotal</span>
                    <span className="font-italiana text-base text-deep-ivory">$7,375</span>
                  </div>
                </div>
              </div>

              {/* Pending */}
              <div>
                <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-rose inline-block" />
                  Pending Payment
                </h3>
                <div className="border border-soft-gray/20 rounded overflow-hidden">
                  {PENDING_ITEMS.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 === 0 ? 'bg-ivory' : 'bg-warm-cream'}`}>
                      <span className="font-crimson text-sm text-dark-taupe">{item.item}</span>
                      <span className="font-crimson text-sm text-deep-ivory">{item.cost}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted-rose/10 border-t border-soft-gray/20">
                    <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-deep-ivory">Subtotal</span>
                    <span className="font-italiana text-base text-muted-rose">$32,500–$35,700</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reception scenarios */}
            <div className="mt-8">
              <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory mb-3">
                Reception Cost Scenarios
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { guests: 100, tables: 13, total: '$20,800' },
                  { guests: 120, tables: 15, total: '$24,000' },
                ].map(({ guests, tables, total }) => (
                  <div key={guests} className="border border-soft-gray/20 rounded px-4 py-3 bg-warm-cream">
                    <p className="font-italiana text-2xl text-dark-taupe">{guests} guests</p>
                    <p className="font-crimson text-sm text-deep-ivory">{tables} tables of 8 · {total} total</p>
                    <p className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray mt-1">
                      $1,600/table · open bar + Chinese menu
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Vendors ───────────────────────────────────────── */}
        {activeSection === 'vendors' && (
          <section>
            <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line mb-6">
              Vendor Contacts
            </h2>

            <div className="grid gap-3">
              {VENDORS.map((v) => (
                <div key={v.vendor} className="border border-soft-gray/20 rounded-lg px-5 py-4 bg-warm-cream flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-italiana text-lg text-dark-taupe leading-none">{v.vendor}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-work-sans tracking-wider uppercase ${vendorStatusStyles[v.status]}`}>
                        {vendorStatusLabel[v.status]}
                      </span>
                    </div>
                    <p className="font-crimson text-sm text-deep-ivory mt-1">{v.service}</p>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">Budget</p>
                      <p className="font-crimson text-sm text-dark-taupe">{v.budget}</p>
                    </div>
                    <div>
                      <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">Contact</p>
                      <p className="font-crimson text-sm text-dark-taupe">{v.contact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-lora italic text-xs text-soft-gray mt-6 text-center">
              Contact details to be filled in as vendors are confirmed.
            </p>
          </section>
        )}

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-soft-gray/20 text-center">
          <p className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-soft-gray/50">
            Christine &amp; Michael · September 12, 2026 · Planning Portal
          </p>
        </div>
      </div>
    </div>
  )
}
