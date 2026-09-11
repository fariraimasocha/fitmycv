"use client";

import { PaletteIcon, TextAaIcon, MinusIcon, TextIndentIcon } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_TEMPLATE_STYLE,
  TEMPLATE_COLOR_OPTIONS,
  TEMPLATE_FONT_OPTIONS,
  getTemplateFontOption,
  normalizeTemplateStyle,
  supportsStructureToggles,
} from "@/utils/cv-templates/style";

export { DEFAULT_TEMPLATE_STYLE };

function GroupLabel({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--landing-ink)]">
      <Icon size={16} className="text-[var(--landing-ink-faint)]" aria-hidden="true" />
      {children}
    </span>
  );
}

function StyleToggle({ icon, label, checked, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2.5">
      <GroupLabel icon={icon}>{label}</GroupLabel>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        data-on={checked}
        className="landing-switch cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-ink)] focus-visible:ring-offset-2"
      >
        <span />
      </button>
    </div>
  );
}

function Divider() {
  return <span aria-hidden="true" className="hidden h-6 w-px bg-[var(--landing-line)] lg:block" />;
}

/**
 * The colour, font and structure controls that restyle a CV preview live.
 *
 * `sticky` parks the bar under the site header while the previews it controls
 * scroll past. A sticky element only travels within its own parent, so the
 * caller must put the bar and those previews in the same wrapper.
 *
 * `template` disables the two structural toggles on layouts that ignore them.
 * Omit it where the bar drives more than one template at once.
 */
export default function TemplateStyleToolbar({
  value,
  onChange,
  template,
  sticky = false,
  className = "",
}) {
  const style = normalizeTemplateStyle(value);

  // A toggle that changes nothing is worse than no toggle, so the two
  // structural switches disable themselves on layouts that draw neither rules
  // nor hanging bullets. The stored value is kept either way.
  const structural = template === undefined || supportsStructureToggles(template);

  const update = (patch) => onChange(normalizeTemplateStyle({ ...style, ...patch }));

  // ponytail: the bar carries its shadow at all times rather than raising one
  // only once stuck. Detecting "stuck" needs a sentinel plus an observer tuned
  // to the header height, and the payoff is a shadow nobody sees change.
  //
  // The sticky variant paints its own translucent background in CSS, so it must
  // not also carry a bg utility: utilities win the cascade over the components
  // layer and would make it opaque again.
  const surface = sticky ? "landing-sticky-bar" : "bg-[var(--landing-surface)]";

  return (
    <div
      className={`${surface} flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-[var(--landing-line)] px-4 py-3 landing-shadow-lift ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <GroupLabel icon={PaletteIcon}>Accent colour</GroupLabel>
        <div className="flex items-center gap-1.5">
          {TEMPLATE_COLOR_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-label={option.label}
              aria-pressed={style.color === option.id}
              data-selected={style.color === option.id}
              onClick={() => update({ color: option.id })}
              style={{ background: option.swatch }}
              className="landing-swatch cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-ink)] focus-visible:ring-offset-2"
            />
          ))}
        </div>
      </div>

      <Divider />

      <div className="flex items-center gap-2.5">
        <GroupLabel icon={TextAaIcon}>Font</GroupLabel>
        <Select value={style.font} onValueChange={(font) => update({ font })}>
          <SelectTrigger
            aria-label="Font"
            className="h-9 w-44 rounded-lg border-[var(--landing-line)] bg-[var(--landing-surface)] text-sm"
          >
            <SelectValue>
              <span style={{ fontFamily: getTemplateFontOption(style.font).stack }}>
                {getTemplateFontOption(style.font).label}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_FONT_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {/* Each row previews its own face, so the choice is visible
                    before it is made. */}
                <span style={{ fontFamily: option.stack }}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Divider />

      <StyleToggle
        icon={MinusIcon}
        label="Dividers"
        checked={style.dividers}
        disabled={!structural}
        onChange={(dividers) => update({ dividers })}
      />

      <Divider />

      <StyleToggle
        icon={TextIndentIcon}
        label="Indent"
        checked={style.indent}
        disabled={!structural}
        onChange={(indent) => update({ indent })}
      />
    </div>
  );
}
