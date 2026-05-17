'use client'

export interface Child {
  name: string
  age: string
  highChair: boolean
}

interface PartyCompositionProps {
  plusOneAllowed: boolean
  plusOne: boolean
  plusOneName: string
  hasChildren: boolean
  children: Child[]
  onPlusOneToggle: (v: boolean) => void
  onPlusOneNameChange: (v: string) => void
  onChildrenToggle: (v: boolean) => void
  onChildrenChange: (children: Child[]) => void
  errors: {
    plusOneName?: string
    children?: string[]
  }
}

const inputClass =
  'w-full bg-ivory border border-gold-line/60 px-4 py-3.5 min-h-[48px] font-crimson text-base text-dark-taupe placeholder:text-soft-gray focus:border-gold-line focus:ring-0 transition-colors duration-200'

const checkboxLabel = 'flex items-center gap-3 cursor-pointer min-h-[44px]'
const checkboxClass = 'w-5 h-5 border border-gold-line/60 accent-gold-line cursor-pointer flex-shrink-0'

export default function PartyComposition({
  plusOneAllowed,
  plusOne,
  plusOneName,
  hasChildren,
  children,
  onPlusOneToggle,
  onPlusOneNameChange,
  onChildrenToggle,
  onChildrenChange,
  errors,
}: PartyCompositionProps) {
  const addChild = () => {
    onChildrenChange([...children, { name: '', age: '', highChair: false }])
  }

  const removeChild = (index: number) => {
    onChildrenChange(children.filter((_, i) => i !== index))
  }

  const updateChild = (index: number, field: keyof Child, value: string | boolean) => {
    onChildrenChange(
      children.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Plus One */}
      {plusOneAllowed && (
        <div className="flex flex-col gap-3">
          <label className={checkboxLabel}>
            <input
              type="checkbox"
              checked={plusOne}
              onChange={(e) => onPlusOneToggle(e.target.checked)}
              className={checkboxClass}
            />
            <span className="font-crimson text-base sm:text-lg text-dark-taupe">
              I&apos;m bringing a plus one
            </span>
          </label>

          {plusOne && (
            <div className="pl-8 flex flex-col gap-2">
              <input
                type="text"
                value={plusOneName}
                onChange={(e) => onPlusOneNameChange(e.target.value)}
                placeholder="Plus one's full name"
                aria-label="Plus one name"
                className={inputClass}
              />
              {errors.plusOneName && (
                <p className="font-crimson italic text-sm text-muted-rose">{errors.plusOneName}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Children */}
      <div className="flex flex-col gap-3">
        <label className={checkboxLabel}>
          <input
            type="checkbox"
            checked={hasChildren}
            onChange={(e) => {
              onChildrenToggle(e.target.checked)
              if (e.target.checked && children.length === 0) {
                onChildrenChange([{ name: '', age: '', highChair: false }])
              }
              if (!e.target.checked) {
                onChildrenChange([])
              }
            }}
            className={checkboxClass}
          />
          <span className="font-crimson text-base sm:text-lg text-dark-taupe">
            Children will be joining us
            <span className="ml-2 font-lora italic text-base text-muted-rose">
              (warmly welcome!)
            </span>
          </span>
        </label>

        {hasChildren && (
          <div className="pl-8 flex flex-col gap-4">
            {children.map((child, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 bg-warm-cream/50 border border-pale-gold/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-work-sans text-[11px] tracking-[0.15em] uppercase text-dark-taupe/70">
                    Child {i + 1}
                  </span>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(i)}
                      className="font-work-sans text-[10px] tracking-[0.12em] uppercase text-muted-rose hover:text-dark-taupe transition-colors duration-200"
                      aria-label={`Remove child ${i + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateChild(i, 'name', e.target.value)}
                      placeholder="Child's name"
                      aria-label={`Child ${i + 1} name`}
                      className={inputClass}
                    />
                    {errors.children?.[i] && (
                      <p className="font-crimson italic text-sm text-muted-rose">{errors.children[i]}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <input
                      type="number"
                      value={child.age}
                      onChange={(e) => updateChild(i, 'age', e.target.value)}
                      placeholder="Age"
                      min="0"
                      max="17"
                      aria-label={`Child ${i + 1} age`}
                      className={inputClass}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer min-h-[40px] mt-1">
                  <input
                    type="checkbox"
                    checked={child.highChair}
                    onChange={(e) => updateChild(i, 'highChair', e.target.checked)}
                    className={checkboxClass}
                    aria-label={`High chair needed for child ${i + 1}`}
                  />
                  <span className="font-crimson text-base text-dark-taupe/85">
                    High chair needed
                  </span>
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={addChild}
              className="self-start font-work-sans text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 border border-gold-line/50 text-dark-taupe hover:bg-blush transition-colors duration-200 min-h-[44px]"
            >
              + Add Another Child
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
