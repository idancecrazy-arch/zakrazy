'use client'

import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

type TaskStatus = 'done' | 'in-progress' | 'pending'

type Task = {
  id: string
  title: string
  category: string
  status: TaskStatus
  assignee: string
  dueLabel: string
  notes: string
}

type DeadlineUrgency = 'wedding' | 'critical' | 'soon' | 'upcoming'

type Deadline = {
  id: string
  date: string
  label: string
  title: string
  bullets: string[]
  urgency: DeadlineUrgency
}

type BudgetItem = {
  id: string
  item: string
  cost: string
  status: 'paid' | 'pending'
}

type Vendor = {
  id: string
  vendor: string
  service: string
  contact: string
  phone: string
  email: string
  website: string
  notes: string
  budget: string
  category: string
  status: 'confirmed' | 'deposit-paid' | 'pending' | 'in-discussion'
}

type ReceptionScenario = {
  id: string
  label: string
  guests: number
  seatsPerTable: number
  costPerTable: number
}

// ── Seed data ──────────────────────────────────────────────────────────────────

const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'd1',
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
    id: 'd2',
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
    id: 'd3',
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
    id: 'd4',
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
    id: 'd5',
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
    id: 'd6',
    date: 'September 12, 2026',
    label: '🎊 WEDDING DAY',
    title: "Christine & Michael's Wedding",
    bullets: [
      "Ceremony: 2:00 PM at St. Joseph's Church, Greenwich Village",
      'Reception setup: arrive 4:00 PM at Golden Unicorn',
      'Reception: 5:00 PM – 10:00 PM at Golden Unicorn',
    ],
    urgency: 'wedding',
  },
]

const INITIAL_TASKS: Task[] = [
  { id: 't1',  title: 'Make bridal bouquet',                                      category: 'DIY',            status: 'pending',     assignee: '',                    dueLabel: 'Sep 10', notes: '' },
  { id: 't2',  title: 'Prepare flower girl basket with roses',                    category: 'DIY',            status: 'pending',     assignee: '',                    dueLabel: 'Sep 10', notes: '' },
  { id: 't3',  title: 'Source vases for floral arrangements',                     category: 'DIY',            status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't4',  title: 'Confirm final details with Jin Krista (music)',             category: 'Vendors',        status: 'pending',     assignee: '',                    dueLabel: 'Jun 12', notes: '' },
  { id: 't5',  title: 'Finalize photographer booking (6 hrs or 8 hrs?)',           category: 'Vendors',        status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't6',  title: 'Confirm DJ details and music preferences',                 category: 'Vendors',        status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't7',  title: 'Coordinate with florist for ceremony arch & centerpieces', category: 'Vendors',        status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't8',  title: 'Confirm lion dancers logistics and timing',                category: 'Vendors',        status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't9',  title: 'Finalize guest count (100 or 120 guests?)',                category: 'Guests',         status: 'in-progress', assignee: '',                    dueLabel: 'Jun 12', notes: '' },
  { id: 't10', title: 'Send out formal invitations',                              category: 'Guests',         status: 'pending',     assignee: '',                    dueLabel: 'Jun 12', notes: '' },
  { id: 't11', title: 'Collect RSVPs',                                            category: 'Guests',         status: 'pending',     assignee: '',                    dueLabel: 'Jul 15', notes: '' },
  { id: 't12', title: 'Finalize ceremony music selections with Jin Krista',       category: 'Ceremony',       status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't13', title: "Coordinate with St. Joseph's Church on timing",            category: 'Ceremony',       status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't14', title: 'Plan processional and recessional order',                  category: 'Ceremony',       status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't15', title: 'Confirm final menu with Golden Unicorn',                   category: 'Reception',      status: 'pending',     assignee: '',                    dueLabel: 'Jun 12', notes: '' },
  { id: 't16', title: 'Plan table layout and seating chart',                      category: 'Reception',      status: 'pending',     assignee: '',                    dueLabel: 'Aug 22', notes: '' },
  { id: 't17', title: 'Arrange transportation if needed',                         category: 'Reception',      status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't18', title: 'Source materials for bridal bouquet',                      category: 'Design & Style', status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't19', title: 'Source roses for flower girl basket',                      category: 'Design & Style', status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't20', title: 'Plan bridesmaid attire (ivory/blush/lilac)',               category: 'Design & Style', status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't21', title: 'Finalize groomsmen attire',                                category: 'Design & Style', status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't22', title: 'Order table number frames',                                category: 'Printing',       status: 'pending',     assignee: '',                    dueLabel: 'Aug 15', notes: '' },
  { id: 't23', title: 'Order ceremony programs',                                  category: 'Printing',       status: 'pending',     assignee: '',                    dueLabel: 'Aug 15', notes: '' },
  { id: 't24', title: 'Order seating cards / place cards',                        category: 'Printing',       status: 'pending',     assignee: '',                    dueLabel: 'Aug 15', notes: '' },
  { id: 't25', title: 'Order guest list for check-in table',                      category: 'Printing',       status: 'pending',     assignee: '',                    dueLabel: 'Aug 15', notes: '' },
  { id: 't26', title: 'Order menu cards (optional)',                              category: 'Printing',       status: 'pending',     assignee: '',                    dueLabel: 'Aug 15', notes: '' },
  { id: 't27', title: 'Complete marriage prep class',                             category: 'Other',          status: 'in-progress', assignee: 'Christine & Michael', dueLabel: 'Sep 12', notes: '' },
  { id: 't28', title: 'Wedding dress final fittings',                             category: 'Other',          status: 'pending',     assignee: 'Christine',           dueLabel: '',       notes: '' },
  { id: 't29', title: 'Plan rehearsal dinner details',                            category: 'Other',          status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
  { id: 't30', title: 'Arrange wedding day timeline and schedule',                category: 'Other',          status: 'pending',     assignee: '',                    dueLabel: '',       notes: '' },
]

const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  { id: 'b1',  item: 'Marriage class',               cost: '$195',            status: 'paid'    },
  { id: 'b2',  item: 'Wedding dress',                cost: '$3,380',          status: 'paid'    },
  { id: 'b3',  item: 'Website',                      cost: '$100',            status: 'paid'    },
  { id: 'b4',  item: 'Church ceremony fee',          cost: '$2,500',          status: 'paid'    },
  { id: 'b5',  item: 'Reception deposit',            cost: '$500',            status: 'paid'    },
  { id: 'b6',  item: 'Save the Date',                cost: '$0',              status: 'paid'    },
  { id: 'b7',  item: 'Marriage prep class',          cost: '$200',            status: 'pending' },
  { id: 'b8',  item: 'Reception (remaining balance)',cost: '$20,300–$23,500', status: 'pending' },
  { id: 'b9',  item: 'Photography (6 hrs)',          cost: '$3,000',          status: 'pending' },
  { id: 'b10', item: 'DJ',                           cost: '$3,000',          status: 'pending' },
  { id: 'b11', item: 'Florals',                      cost: '$3,000',          status: 'pending' },
  { id: 'b12', item: 'Lion dancers',                 cost: '$1,000',          status: 'pending' },
  { id: 'b13', item: 'Ceremony music – Jin Krista',  cost: '$2,000',          status: 'pending' },
]

const INITIAL_VENDORS: Vendor[] = [
  { id: 'v1', vendor: 'Jin Krista',          service: 'Ceremony Music',          contact: '', phone: '', email: '', website: '', notes: '', budget: '$2,000',           category: 'Music',         status: 'confirmed'     },
  { id: 'v2', vendor: 'Golden Unicorn',      service: 'Reception Venue',         contact: '', phone: '', email: '', website: '', notes: '', budget: '$20,800–$24,000',  category: 'Venue',         status: 'deposit-paid'  },
  { id: 'v3', vendor: 'Photographer',        service: 'Photography (6–8 hrs)',   contact: '', phone: '', email: '', website: '', notes: '', budget: '$3,000–$4,000',    category: 'Photography',   status: 'pending'       },
  { id: 'v4', vendor: 'DJ',                  service: 'Reception Entertainment', contact: '', phone: '', email: '', website: '', notes: '', budget: '$3,000',           category: 'Entertainment', status: 'pending'       },
  { id: 'v5', vendor: 'Florist',             service: 'Florals & Arrangements',  contact: '', phone: '', email: '', website: '', notes: '', budget: '$3,000',           category: 'Florals',       status: 'pending'       },
  { id: 'v6', vendor: 'Lion Dancers',        service: 'Cultural Entertainment',  contact: '', phone: '', email: '', website: '', notes: '', budget: '$1,000',           category: 'Entertainment', status: 'pending'       },
  { id: 'v7', vendor: "St. Joseph's Church", service: 'Ceremony Venue',          contact: '', phone: '', email: '', website: '', notes: '', budget: '$2,500 (paid)',     category: 'Venue',         status: 'confirmed'     },
  { id: 'v8', vendor: 'Wedding Planner',     service: 'Overall Coordination',    contact: '', phone: '', email: '', website: '', notes: '', budget: 'TBD',             category: 'Coordination',  status: 'in-discussion' },
]

const INITIAL_SCENARIOS: ReceptionScenario[] = [
  { id: 's1', label: 'Scenario A', guests: 100, seatsPerTable: 8, costPerTable: 1600 },
  { id: 's2', label: 'Scenario B', guests: 120, seatsPerTable: 8, costPerTable: 1600 },
]

const INITIAL_CATEGORIES = ['DIY', 'Vendors', 'Guests', 'Ceremony', 'Reception', 'Design & Style', 'Printing', 'Other']

// ── Helpers ────────────────────────────────────────────────────────────────────

let _seq = 0
const genId = () => `x${Date.now()}-${++_seq}`

function parseCost(cost: string): number {
  const digits = cost.replace(/[$,]/g, '').match(/^\d+/)
  return digits ? parseInt(digits[0]) : 0
}

function formatDollars(n: number): string {
  return '$' + n.toLocaleString()
}

// ── Style maps ─────────────────────────────────────────────────────────────────

const urgencyStyles: Record<DeadlineUrgency, { dot: string; card: string; label: string }> = {
  wedding:  { dot: 'bg-lilac',      card: 'border-lilac bg-lilac/10',           label: 'text-dusty-lilac font-semibold' },
  critical: { dot: 'bg-muted-rose', card: 'border-muted-rose bg-muted-rose/10', label: 'text-muted-rose font-semibold'  },
  soon:     { dot: 'bg-gold-line',  card: 'border-gold-line bg-pale-gold/20',   label: 'text-deep-ivory'                },
  upcoming: { dot: 'bg-pale-gold',  card: 'border-pale-gold bg-ivory',          label: 'text-soft-gray'                 },
}

const statusStyles: Record<TaskStatus, { pill: string; label: string }> = {
  done:          { pill: 'bg-gold-line/20 text-deep-ivory border border-gold-line/40',  label: 'Done'        },
  'in-progress': { pill: 'bg-lilac/20 text-dusty-lilac border border-lilac/40',         label: 'In Progress' },
  pending:       { pill: 'bg-soft-gray/20 text-soft-gray border border-soft-gray/40',   label: 'Pending'     },
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
  pending:      'in-progress',
  'in-progress': 'done',
  done:         'pending',
}

// ── Shared input/button style strings ─────────────────────────────────────────

const inputCls = [
  'bg-ivory/80 border border-soft-gray/40 rounded px-2.5 py-1.5',
  'text-sm font-crimson text-dark-taupe',
  'focus:outline-none focus:border-gold-line',
  'w-full min-h-[36px]',
].join(' ')

const smallInputCls = [
  'bg-ivory/80 border border-soft-gray/40 rounded px-2 py-1',
  'text-xs font-crimson text-dark-taupe',
  'focus:outline-none focus:border-gold-line',
  'min-h-[32px]',
].join(' ')

const selectCls = [
  'bg-ivory/80 border border-soft-gray/40 rounded px-2 py-1',
  'text-xs font-crimson text-dark-taupe',
  'focus:outline-none focus:border-gold-line',
  'min-h-[32px]',
].join(' ')

const deleteBtnCls = [
  'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded',
  'text-soft-gray hover:text-muted-rose hover:bg-muted-rose/10',
  'transition-colors text-xl leading-none',
].join(' ')

const addRowBtnCls = [
  'font-work-sans text-[9px] tracking-[0.2em] uppercase',
  'text-soft-gray hover:text-gold-line transition-colors py-1',
].join(' ')

// ── StatusPill ─────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: TaskStatus }) {
  const s = statusStyles[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-work-sans tracking-wider uppercase whitespace-nowrap ${s.pill}`}>
      {s.label}
    </span>
  )
}

// ── TaskRow ────────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  isEditing,
  categories,
  onUpdate,
  onDelete,
}: {
  task: Task
  isEditing: boolean
  categories: string[]
  onUpdate: (id: string, changes: Partial<Task>) => void
  onDelete: (id: string) => void
}) {
  const [editingAssignee, setEditingAssignee] = useState(false)
  const [assigneeInput, setAssigneeInput] = useState(task.assignee)

  const commitAssignee = () => {
    setEditingAssignee(false)
    onUpdate(task.id, { assignee: assigneeInput })
  }

  if (isEditing) {
    return (
      <div className="py-3 border-b border-soft-gray/20 last:border-0 space-y-2">
        <div className="flex items-start gap-2">
          <input
            value={task.title}
            onChange={e => onUpdate(task.id, { title: e.target.value })}
            className={`${inputCls} flex-1`}
            placeholder="Task title"
          />
          <button onClick={() => onDelete(task.id)} className={deleteBtnCls} title="Delete task">×</button>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 min-w-[160px]">
            <span className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray flex-shrink-0">Category</span>
            <input
              list={`cats-${task.id}`}
              value={task.category}
              onChange={e => onUpdate(task.id, { category: e.target.value })}
              className={`${smallInputCls} flex-1`}
              placeholder="Category"
            />
            <datalist id={`cats-${task.id}`}>
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray flex-shrink-0">Due</span>
            <input
              value={task.dueLabel}
              onChange={e => onUpdate(task.id, { dueLabel: e.target.value })}
              className={`${smallInputCls} w-24`}
              placeholder="e.g. Jun 12"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray flex-shrink-0">Assigned</span>
            <input
              value={task.assignee}
              onChange={e => onUpdate(task.id, { assignee: e.target.value })}
              className={`${smallInputCls} w-32`}
              placeholder="Name"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray flex-shrink-0">Status</span>
            <select
              value={task.status}
              onChange={e => onUpdate(task.id, { status: e.target.value as TaskStatus })}
              className={selectCls}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        {(task.notes || isEditing) && (
          <input
            value={task.notes}
            onChange={e => onUpdate(task.id, { notes: e.target.value })}
            className={`${smallInputCls} w-full`}
            placeholder="Notes (optional)"
          />
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-start gap-3 py-3 border-b border-soft-gray/20 last:border-0 ${task.status === 'done' ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onUpdate(task.id, { status: nextStatus[task.status] })}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border border-gold-line/50 flex items-center justify-center hover:border-gold-line transition-colors"
        title={`Mark as ${nextStatus[task.status]}`}
      >
        {task.status === 'done' && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7L10 1" stroke="#C3AF82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {task.status === 'in-progress' && (
          <div className="w-2 h-2 rounded-full bg-dusty-lilac" />
        )}
      </button>

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
              onBlur={commitAssignee}
              onKeyDown={e => { if (e.key === 'Enter') commitAssignee() }}
              placeholder="assign to…"
              className="font-work-sans text-[10px] tracking-wide text-deep-ivory bg-transparent border-b border-gold-line/50 focus:border-gold-line outline-none w-28 pb-0.5"
            />
          ) : (
            <button
              onClick={() => { setAssigneeInput(task.assignee); setEditingAssignee(true) }}
              className="font-work-sans text-[10px] tracking-wide text-deep-ivory/60 hover:text-gold-line transition-colors"
            >
              {task.assignee ? `→ ${task.assignee}` : '+ assign'}
            </button>
          )}
        </div>
        {task.notes && (
          <p className="font-crimson text-xs text-soft-gray mt-1 italic">{task.notes}</p>
        )}
      </div>
    </div>
  )
}

// ── Edit mode toggle button ────────────────────────────────────────────────────

function EditToggle({ isEditing, onToggle }: { isEditing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={[
        'font-work-sans text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border rounded transition-colors',
        isEditing
          ? 'bg-dark-taupe text-ivory border-dark-taupe'
          : 'text-soft-gray border-soft-gray/40 hover:border-gold-line hover:text-deep-ivory',
      ].join(' ')}
    >
      {isEditing ? 'Done' : 'Edit'}
    </button>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PlannerDashboard() {
  const [deadlines, setDeadlines]     = useState<Deadline[]>(INITIAL_DEADLINES)
  const [tasks, setTasks]             = useState<Task[]>(INITIAL_TASKS)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_ITEMS)
  const [vendors, setVendors]         = useState<Vendor[]>(INITIAL_VENDORS)
  const [scenarios, setScenarios]     = useState<ReceptionScenario[]>(INITIAL_SCENARIOS)
  const [categories, setCategories]   = useState<string[]>(INITIAL_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSection, setActiveSection]   = useState<'timeline' | 'tasks' | 'budget' | 'vendors'>('timeline')
  const [isEditing, setIsEditing]     = useState(false)
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCatValue, setNewCatValue] = useState('')

  const setSection = (s: typeof activeSection) => {
    setActiveSection(s)
    setIsEditing(false)
  }

  // ── Task handlers ───────────────────────────────────────────────────────────

  const updateTask = (id: string, changes: Partial<Task>) => {
    if (changes.category && !categories.includes(changes.category)) {
      setCategories(prev => [...prev, changes.category!])
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t))
  }

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id))

  const addTask = () => {
    const cat = activeCategory !== 'All' ? activeCategory : (categories[0] ?? 'Other')
    setTasks(prev => [...prev, { id: genId(), title: 'New task', category: cat, status: 'pending', assignee: '', dueLabel: '', notes: '' }])
  }

  const commitNewCategory = () => {
    const trimmed = newCatValue.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed])
    }
    setNewCatValue('')
    setAddingCategory(false)
  }

  // ── Deadline handlers ───────────────────────────────────────────────────────

  const updateDeadline = (id: string, changes: Partial<Deadline>) =>
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, ...changes } : d))

  const deleteDeadline = (id: string) => setDeadlines(prev => prev.filter(d => d.id !== id))

  const addDeadline = () =>
    setDeadlines(prev => [...prev, { id: genId(), date: '', label: '', title: 'New milestone', bullets: [], urgency: 'upcoming' }])

  const updateBullet = (dlId: string, i: number, val: string) =>
    updateDeadline(dlId, { bullets: deadlines.find(d => d.id === dlId)!.bullets.map((b, j) => j === i ? val : b) })

  const removeBullet = (dlId: string, i: number) =>
    updateDeadline(dlId, { bullets: deadlines.find(d => d.id === dlId)!.bullets.filter((_, j) => j !== i) })

  const addBullet = (dlId: string) =>
    updateDeadline(dlId, { bullets: [...deadlines.find(d => d.id === dlId)!.bullets, ''] })

  // ── Budget handlers ─────────────────────────────────────────────────────────

  const updateBudgetItem = (id: string, changes: Partial<BudgetItem>) =>
    setBudgetItems(prev => prev.map(b => b.id === id ? { ...b, ...changes } : b))

  const deleteBudgetItem = (id: string) => setBudgetItems(prev => prev.filter(b => b.id !== id))

  const addBudgetItem = (status: 'paid' | 'pending') =>
    setBudgetItems(prev => [...prev, { id: genId(), item: 'New item', cost: '$0', status }])

  // ── Vendor handlers ─────────────────────────────────────────────────────────

  const updateVendor = (id: string, changes: Partial<Vendor>) =>
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...changes } : v))

  const deleteVendor = (id: string) => setVendors(prev => prev.filter(v => v.id !== id))

  const addVendor = () =>
    setVendors(prev => [...prev, { id: genId(), vendor: 'New Vendor', service: '', contact: '', phone: '', email: '', website: '', notes: '', budget: '', category: 'Other', status: 'pending' }])

  // ── Scenario handlers ───────────────────────────────────────────────────────

  const updateScenario = (id: string, changes: Partial<ReceptionScenario>) =>
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))

  const deleteScenario = (id: string) => setScenarios(prev => prev.filter(s => s.id !== id))

  const addScenario = () =>
    setScenarios(prev => [...prev, { id: genId(), label: `Scenario ${String.fromCharCode(65 + prev.length)}`, guests: 100, seatsPerTable: 8, costPerTable: 1600 }])

  // ── Derived values ──────────────────────────────────────────────────────────

  const allCats = [...categories, ...tasks.map(t => t.category).filter(c => !categories.includes(c))]

  const groupedTasks = allCats.reduce<Record<string, Task[]>>((acc, cat) => {
    const catTasks = tasks.filter(t => t.category === cat)
    if (catTasks.length) acc[cat] = catTasks
    return acc
  }, {})

  const filteredTasks = activeCategory === 'All' ? tasks : tasks.filter(t => t.category === activeCategory)

  const vendorCats = [...new Set(vendors.map(v => v.category))]
  const groupedVendors = vendorCats.reduce<Record<string, Vendor[]>>((acc, cat) => {
    acc[cat] = vendors.filter(v => v.category === cat)
    return acc
  }, {})

  const doneTasks       = tasks.filter(t => t.status === 'done').length
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length
  const pendingTasks    = tasks.filter(t => t.status === 'pending').length

  const paidItems    = budgetItems.filter(b => b.status === 'paid')
  const pendingItems = budgetItems.filter(b => b.status === 'pending')
  const paidTotal    = paidItems.reduce((sum, b) => sum + parseCost(b.cost), 0)
  const pendingMin   = pendingItems.reduce((sum, b) => sum + parseCost(b.cost), 0)
  const estimated    = paidTotal + pendingMin
  const progressPct  = estimated > 0 ? Math.round(paidTotal / estimated * 100) : 0

  const handleLogout = async () => {
    await fetch('/api/planner-auth/logout', { method: 'POST' }).catch(() => {})
    document.cookie = 'planner-auth=; Max-Age=0; path=/'
    window.location.replace('/planner/login')
  }

  const navItems: { key: typeof activeSection; label: string }[] = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'tasks',    label: 'Tasks'    },
    { key: 'budget',   label: 'Budget'   },
    { key: 'vendors',  label: 'Vendors'  },
  ]

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-ivory border-b border-soft-gray/30 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-italiana text-lg text-dark-taupe tracking-wide leading-none whitespace-nowrap">
              Christine &amp; Michael
            </span>
            <span className="hidden sm:block font-work-sans text-[9px] tracking-[0.3em] uppercase text-soft-gray">
              Wedding Coordination
            </span>
          </div>

          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={[
                  'font-work-sans text-[9px] tracking-[0.2em] uppercase px-2.5 py-1.5 transition-colors whitespace-nowrap flex-shrink-0',
                  activeSection === key
                    ? 'text-dark-taupe border-b-2 border-gold-line'
                    : 'text-soft-gray hover:text-deep-ivory',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray hover:text-muted-rose transition-colors flex-shrink-0"
          >
            Exit
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
        {/* ── Stats row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Tasks', value: tasks.length,    color: 'text-dark-taupe'   },
            { label: 'Done',        value: doneTasks,        color: 'text-deep-ivory'   },
            { label: 'In Progress', value: inProgressTasks,  color: 'text-dusty-lilac'  },
            { label: 'Pending',     value: pendingTasks,     color: 'text-soft-gray'    },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-3">
              <p className={`font-crimson font-semibold text-3xl ${color} leading-none mb-1`}>{value}</p>
              <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Timeline ────────────────────────────────────────────────────── */}
        {activeSection === 'timeline' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
                Critical Deadlines
              </h2>
              <EditToggle isEditing={isEditing} onToggle={() => setIsEditing(e => !e)} />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-soft-gray/30" />

              <div className="flex flex-col gap-5 pl-10">
                {deadlines.map((dl) => {
                  const s = urgencyStyles[dl.urgency]
                  return (
                    <div key={dl.id} className="relative">
                      <div className={`absolute -left-7 top-2 w-3 h-3 rounded-full ${s.dot} ring-2 ring-ivory`} />

                      <div className={`border rounded-lg p-4 ${s.card}`}>
                        {isEditing ? (
                          <div className="space-y-2">
                            {/* Row 1: date · label · urgency · delete */}
                            <div className="flex flex-wrap gap-2 items-center">
                              <input
                                value={dl.date}
                                onChange={e => updateDeadline(dl.id, { date: e.target.value })}
                                placeholder="Date (e.g. May 5, 2026)"
                                className={`${smallInputCls} flex-1 min-w-[130px]`}
                              />
                              <input
                                value={dl.label}
                                onChange={e => updateDeadline(dl.id, { label: e.target.value })}
                                placeholder="Label (e.g. CRITICAL)"
                                className={`${smallInputCls} flex-1 min-w-[100px]`}
                              />
                              <select
                                value={dl.urgency}
                                onChange={e => updateDeadline(dl.id, { urgency: e.target.value as DeadlineUrgency })}
                                className={selectCls}
                              >
                                <option value="wedding">Wedding</option>
                                <option value="critical">Critical</option>
                                <option value="soon">Soon</option>
                                <option value="upcoming">Upcoming</option>
                              </select>
                              <button onClick={() => deleteDeadline(dl.id)} className={deleteBtnCls} title="Delete deadline">×</button>
                            </div>
                            {/* Row 2: title */}
                            <input
                              value={dl.title}
                              onChange={e => updateDeadline(dl.id, { title: e.target.value })}
                              placeholder="Milestone title"
                              className={inputCls}
                            />
                            {/* Bullets */}
                            <div className="space-y-1.5 mt-1">
                              {dl.bullets.map((b, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <input
                                    value={b}
                                    onChange={e => updateBullet(dl.id, i, e.target.value)}
                                    placeholder="Bullet point"
                                    className={`${inputCls} flex-1`}
                                  />
                                  <button onClick={() => removeBullet(dl.id, i)} className={deleteBtnCls} title="Remove bullet">×</button>
                                </div>
                              ))}
                              <button onClick={() => addBullet(dl.id)} className={addRowBtnCls}>
                                + add bullet
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-2">
                              <span className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray">{dl.date}</span>
                              <span className={`font-work-sans text-[10px] tracking-[0.2em] uppercase ${s.label}`}>{dl.label}</span>
                            </div>
                            <h3 className="font-crimson font-semibold text-lg text-dark-taupe mb-2 leading-snug">
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
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 ml-10">
                <button onClick={addDeadline} className={addRowBtnCls}>+ Add deadline</button>
              </div>
            )}
          </section>
        )}

        {/* ── Tasks ───────────────────────────────────────────────────────── */}
        {activeSection === 'tasks' && (
          <section>
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
                Task Board
              </h2>
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <p className="hidden sm:block font-crimson italic text-xs text-soft-gray">
                    Click ○ to cycle status · click "assign" to set name
                  </p>
                )}
                <EditToggle isEditing={isEditing} onToggle={() => setIsEditing(e => !e)} />
              </div>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {['All', ...allCats].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={[
                    'flex-shrink-0 font-work-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 border rounded-full transition-colors',
                    activeCategory === cat
                      ? 'bg-dark-taupe text-ivory border-dark-taupe'
                      : 'bg-transparent text-deep-ivory border-soft-gray/40 hover:border-gold-line hover:text-dark-taupe',
                  ].join(' ')}
                >
                  {cat}
                </button>
              ))}
              {isEditing && (
                addingCategory ? (
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <input
                      autoFocus
                      value={newCatValue}
                      onChange={e => setNewCatValue(e.target.value)}
                      onBlur={commitNewCategory}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitNewCategory()
                        if (e.key === 'Escape') { setNewCatValue(''); setAddingCategory(false) }
                      }}
                      placeholder="Category name"
                      className={`${smallInputCls} w-28`}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingCategory(true)}
                    className="flex-shrink-0 font-work-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 border border-dashed border-soft-gray/40 rounded-full text-soft-gray hover:border-gold-line transition-colors"
                  >
                    + category
                  </button>
                )
              )}
            </div>

            {/* Task list */}
            {activeCategory === 'All' ? (
              Object.entries(groupedTasks).map(([cat, catTasks]) => (
                <div key={cat} className="mb-6">
                  <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-soft-gray mb-2 pb-1 border-b border-soft-gray/20 flex items-center gap-2">
                    {cat}
                    <span className="normal-case font-crimson text-xs">
                      {catTasks.filter(t => t.status === 'done').length}/{catTasks.length}
                    </span>
                  </h3>
                  {catTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      isEditing={isEditing}
                      categories={allCats}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  {isEditing && activeCategory === 'All' && (
                    <button
                      onClick={() => setTasks(prev => [...prev, { id: genId(), title: 'New task', category: cat, status: 'pending', assignee: '', dueLabel: '', notes: '' }])}
                      className={`${addRowBtnCls} mt-1 pl-8`}
                    >
                      + add to {cat}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div>
                {filteredTasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isEditing={isEditing}
                    categories={allCats}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}

            {isEditing && activeCategory !== 'All' && (
              <button onClick={addTask} className={`${addRowBtnCls} mt-2`}>+ Add task</button>
            )}
          </section>
        )}

        {/* ── Budget ──────────────────────────────────────────────────────── */}
        {activeSection === 'budget' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
                Budget Tracker
              </h2>
              <EditToggle isEditing={isEditing} onToggle={() => setIsEditing(e => !e)} />
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-4 text-center">
                <p className="font-crimson font-semibold text-2xl text-deep-ivory">{formatDollars(paidTotal)}</p>
                <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mt-1">Total Paid</p>
              </div>
              <div className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-4 text-center">
                <p className="font-crimson font-semibold text-2xl text-muted-rose">{formatDollars(pendingMin)}+</p>
                <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mt-1">Remaining (est. min)</p>
              </div>
              <div className="bg-warm-cream border border-soft-gray/20 rounded px-4 py-4 text-center">
                <p className="font-crimson font-semibold text-2xl text-dark-taupe">{formatDollars(estimated)}+</p>
                <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mt-1">Estimated Total</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-1">
                <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">Budget paid</span>
                <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-deep-ivory">{progressPct}%</span>
              </div>
              <div className="h-1.5 bg-soft-gray/20 rounded-full overflow-hidden">
                <div className="h-full bg-gold-line rounded-full transition-all" style={{ width: `${progressPct}%` }} />
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
                  {paidItems.map((item, i) => (
                    <div key={item.id} className={`flex items-center gap-2 px-3 py-2 ${i % 2 === 0 ? 'bg-ivory' : 'bg-warm-cream'}`}>
                      {isEditing ? (
                        <>
                          <input
                            value={item.item}
                            onChange={e => updateBudgetItem(item.id, { item: e.target.value })}
                            className={`${smallInputCls} flex-1`}
                            placeholder="Item name"
                          />
                          <input
                            value={item.cost}
                            onChange={e => updateBudgetItem(item.id, { cost: e.target.value })}
                            className={`${smallInputCls} w-24`}
                            placeholder="$0"
                          />
                          <button
                            onClick={() => updateBudgetItem(item.id, { status: 'pending' })}
                            className="font-work-sans text-[9px] text-soft-gray hover:text-muted-rose transition-colors whitespace-nowrap"
                            title="Move to pending"
                          >
                            → pending
                          </button>
                          <button onClick={() => deleteBudgetItem(item.id)} className={`${deleteBtnCls} w-6 h-6 text-base`} title="Delete">×</button>
                        </>
                      ) : (
                        <>
                          <span className="font-crimson text-sm text-dark-taupe flex-1">{item.item}</span>
                          <span className="font-crimson text-sm text-deep-ivory">{item.cost}</span>
                          <span className="text-gold-line text-xs">✓</span>
                        </>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2 bg-pale-gold/20 border-t border-soft-gray/20">
                    <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-deep-ivory">Subtotal</span>
                    <span className="font-crimson font-semibold text-base text-deep-ivory">{formatDollars(paidTotal)}</span>
                  </div>
                  {isEditing && (
                    <div className="px-3 py-2 bg-ivory border-t border-soft-gray/10">
                      <button onClick={() => addBudgetItem('paid')} className={addRowBtnCls}>+ Add paid item</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pending */}
              <div>
                <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-rose inline-block" />
                  Pending Payment
                </h3>
                <div className="border border-soft-gray/20 rounded overflow-hidden">
                  {pendingItems.map((item, i) => (
                    <div key={item.id} className={`flex items-center gap-2 px-3 py-2 ${i % 2 === 0 ? 'bg-ivory' : 'bg-warm-cream'}`}>
                      {isEditing ? (
                        <>
                          <input
                            value={item.item}
                            onChange={e => updateBudgetItem(item.id, { item: e.target.value })}
                            className={`${smallInputCls} flex-1`}
                            placeholder="Item name"
                          />
                          <input
                            value={item.cost}
                            onChange={e => updateBudgetItem(item.id, { cost: e.target.value })}
                            className={`${smallInputCls} w-24`}
                            placeholder="$0"
                          />
                          <button
                            onClick={() => updateBudgetItem(item.id, { status: 'paid' })}
                            className="font-work-sans text-[9px] text-soft-gray hover:text-gold-line transition-colors whitespace-nowrap"
                            title="Mark as paid"
                          >
                            → paid
                          </button>
                          <button onClick={() => deleteBudgetItem(item.id)} className={`${deleteBtnCls} w-6 h-6 text-base`} title="Delete">×</button>
                        </>
                      ) : (
                        <>
                          <span className="font-crimson text-sm text-dark-taupe flex-1">{item.item}</span>
                          <span className="font-crimson text-sm text-deep-ivory">{item.cost}</span>
                        </>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2 bg-muted-rose/10 border-t border-soft-gray/20">
                    <span className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-deep-ivory">Subtotal (est. min)</span>
                    <span className="font-crimson font-semibold text-base text-muted-rose">{formatDollars(pendingMin)}+</span>
                  </div>
                  {isEditing && (
                    <div className="px-3 py-2 bg-ivory border-t border-soft-gray/10">
                      <button onClick={() => addBudgetItem('pending')} className={addRowBtnCls}>+ Add pending item</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reception scenarios */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-deep-ivory">
                  Reception Cost Scenarios
                </h3>
                {isEditing && (
                  <button onClick={addScenario} className={addRowBtnCls}>+ Add scenario</button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {scenarios.map((sc) => {
                  const tables = Math.ceil(sc.guests / sc.seatsPerTable)
                  const total  = tables * sc.costPerTable
                  return (
                    <div key={sc.id} className="border border-soft-gray/20 rounded px-4 py-4 bg-warm-cream">
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              value={sc.label}
                              onChange={e => updateScenario(sc.id, { label: e.target.value })}
                              className={`${smallInputCls} flex-1`}
                              placeholder="Label"
                            />
                            <button onClick={() => deleteScenario(sc.id)} className={`${deleteBtnCls} w-7 h-7 text-base`}>×</button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Guests</label>
                              <input
                                type="number"
                                value={sc.guests}
                                onChange={e => updateScenario(sc.id, { guests: parseInt(e.target.value) || 0 })}
                                className={`${smallInputCls} w-full`}
                                min={1}
                              />
                            </div>
                            <div>
                              <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Seats/Table</label>
                              <input
                                type="number"
                                value={sc.seatsPerTable}
                                onChange={e => updateScenario(sc.id, { seatsPerTable: parseInt(e.target.value) || 1 })}
                                className={`${smallInputCls} w-full`}
                                min={1}
                              />
                            </div>
                            <div>
                              <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">$/Table</label>
                              <input
                                type="number"
                                value={sc.costPerTable}
                                onChange={e => updateScenario(sc.id, { costPerTable: parseInt(e.target.value) || 0 })}
                                className={`${smallInputCls} w-full`}
                                min={0}
                              />
                            </div>
                          </div>
                          <p className="font-crimson text-xs text-deep-ivory pt-1">
                            → {tables} tables · <strong>{formatDollars(total)}</strong> total
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mb-1">{sc.label}</p>
                          <p className="font-crimson font-semibold text-xl text-dark-taupe">{sc.guests} guests</p>
                          <p className="font-crimson text-sm text-deep-ivory">
                            {tables} tables of {sc.seatsPerTable} · {formatDollars(total)} total
                          </p>
                          <p className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray mt-1">
                            {formatDollars(sc.costPerTable)}/table
                          </p>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Vendors ─────────────────────────────────────────────────────── */}
        {activeSection === 'vendors' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-gold-line">
                Vendor Contacts
              </h2>
              <div className="flex items-center gap-3">
                {isEditing && (
                  <button onClick={addVendor} className={addRowBtnCls}>+ Add vendor</button>
                )}
                <EditToggle isEditing={isEditing} onToggle={() => setIsEditing(e => !e)} />
              </div>
            </div>

            {isEditing ? (
              // Edit mode: flat list, all fields expanded
              <div className="grid gap-4">
                {vendors.map((v) => (
                  <div key={v.id} className="border border-soft-gray/20 rounded-lg px-4 py-4 bg-warm-cream space-y-3">
                    {/* Row 1: name · status · category · delete */}
                    <div className="flex flex-wrap items-start gap-2">
                      <input
                        value={v.vendor}
                        onChange={e => updateVendor(v.id, { vendor: e.target.value })}
                        placeholder="Vendor name"
                        className={`${inputCls} flex-1 min-w-[140px] font-semibold`}
                      />
                      <select
                        value={v.status}
                        onChange={e => updateVendor(v.id, { status: e.target.value as Vendor['status'] })}
                        className={selectCls}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="deposit-paid">Deposit Paid</option>
                        <option value="in-discussion">In Discussion</option>
                        <option value="pending">Pending</option>
                      </select>
                      <input
                        list={`vcats-${v.id}`}
                        value={v.category}
                        onChange={e => updateVendor(v.id, { category: e.target.value })}
                        placeholder="Category"
                        className={`${smallInputCls} w-32`}
                      />
                      <datalist id={`vcats-${v.id}`}>
                        {vendorCats.map(c => <option key={c} value={c} />)}
                      </datalist>
                      <button onClick={() => deleteVendor(v.id)} className={deleteBtnCls} title="Delete vendor">×</button>
                    </div>
                    {/* Row 2: service */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex-1 min-w-[180px]">
                        <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Service</label>
                        <input
                          value={v.service}
                          onChange={e => updateVendor(v.id, { service: e.target.value })}
                          placeholder="Service description"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    {/* Row 3: contact name · phone · email */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex-1 min-w-[140px]">
                        <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Contact Name</label>
                        <input
                          value={v.contact}
                          onChange={e => updateVendor(v.id, { contact: e.target.value })}
                          placeholder="Name"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Phone</label>
                        <input
                          value={v.phone}
                          onChange={e => updateVendor(v.id, { phone: e.target.value })}
                          placeholder="(555) 000-0000"
                          type="tel"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex-1 min-w-[160px]">
                        <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Email</label>
                        <input
                          value={v.email}
                          onChange={e => updateVendor(v.id, { email: e.target.value })}
                          placeholder="email@example.com"
                          type="email"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    {/* Row 4: website · notes */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex-1 min-w-[180px]">
                        <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Website</label>
                        <input
                          value={v.website}
                          onChange={e => updateVendor(v.id, { website: e.target.value })}
                          placeholder="https://..."
                          type="url"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className="font-work-sans text-[9px] tracking-wider uppercase text-soft-gray block mb-1">Notes</label>
                        <input
                          value={v.notes}
                          onChange={e => updateVendor(v.id, { notes: e.target.value })}
                          placeholder="Any notes…"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Read mode: grouped by category
              <div className="space-y-8">
                {Object.entries(groupedVendors).map(([cat, catVendors]) => (
                  <div key={cat}>
                    <h3 className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-soft-gray mb-3 pb-1 border-b border-soft-gray/20">
                      {cat}
                    </h3>
                    <div className="grid gap-3">
                      {catVendors.map((v) => (
                        <div key={v.id} className="border border-soft-gray/20 rounded-lg px-4 py-4 bg-warm-cream">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-1">
                                <h4 className="font-crimson font-semibold text-lg text-dark-taupe leading-none">{v.vendor}</h4>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-work-sans tracking-wider uppercase ${vendorStatusStyles[v.status]}`}>
                                  {vendorStatusLabel[v.status]}
                                </span>
                              </div>
                              <p className="font-crimson text-sm text-deep-ivory">{v.service}</p>
                              {v.notes && (
                                <p className="font-crimson text-xs text-soft-gray italic mt-1">{v.notes}</p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-right shrink-0">
                              {(v.contact || v.phone || v.email) && (
                                <div>
                                  <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">Contact</p>
                                  {v.contact && <p className="font-crimson text-sm text-dark-taupe">{v.contact}</p>}
                                  {v.phone   && <p className="font-crimson text-xs text-deep-ivory">{v.phone}</p>}
                                  {v.email   && <p className="font-crimson text-xs text-deep-ivory">{v.email}</p>}
                                </div>
                              )}
                              {v.website && (
                                <div>
                                  <p className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">Website</p>
                                  <a
                                    href={v.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-crimson text-xs text-gold-line hover:underline"
                                  >
                                    {v.website.replace(/^https?:\/\//, '')}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-soft-gray/20 text-center">
          <p className="font-work-sans text-[9px] tracking-[0.25em] uppercase text-soft-gray/50">
            Christine &amp; Michael · September 12, 2026 · Planning Portal
          </p>
        </div>
      </div>
    </div>
  )
}
