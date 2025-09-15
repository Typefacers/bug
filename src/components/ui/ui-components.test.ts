import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Badge } from './badge.tsx'
import { Button } from 'react95'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './card.tsx'
import { Input } from './input.tsx'
import { Label } from './label.tsx'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from './navigation-menu.tsx'
import { Progress } from './progress.tsx'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './select.tsx'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs.tsx'
import { Textarea } from './textarea.tsx'

const h = React.createElement
const wrap = (el: React.ReactElement) => renderToStaticMarkup(el)

test('Badge renders', () => {
  const html = wrap(h(Badge, null, 'Badge'))
  assert.ok(html.includes('Badge'))
})

test('Button renders', () => {
  const html = wrap(h(Button, null, 'Click'))
  assert.ok(html.includes('Click'))
})

test('Card renders', () => {
  const html = wrap(
    h(
      Card,
      null,
      h(CardHeader, null, h(CardTitle, null, 'Title')),
      h(CardContent, null, 'Body'),
      h(CardFooter, null, 'Footer')
    )
  )
  assert.ok(html.includes('Title'))
})

test('Input renders', () => {
  const html = wrap(h(Input, { value: 'x', onChange: () => {} }))
  assert.ok(html.includes('value="x"'))
})

test('Label renders', () => {
  const html = wrap(h(Label, { htmlFor: 'i' }, 'Label'))
  assert.ok(html.includes('Label'))
})

test('NavigationMenu renders', () => {
  const html = wrap(
    h(
      NavigationMenu,
      null,
      h(
        NavigationMenuList,
        null,
        h(
          NavigationMenuItem,
          null,
          h(NavigationMenuTrigger, null, 'Menu'),
          h(NavigationMenuContent, null, 'Content')
        )
      )
    )
  )
  assert.ok(html.includes('Menu'))
})

test('Progress renders', () => {
  const html = wrap(h(Progress, { value: 50 }))
  assert.ok(html.includes('translateX'))
})

test('Select renders', () => {
  const html = wrap(
    h(
      Select,
      { value: 'a', onValueChange: () => {} },
      h(SelectTrigger, null, h(SelectValue, { placeholder: 'sel' })),
      h(SelectContent, null, h(SelectItem, { value: 'a' }, 'A'))
    )
  )
  assert.ok(html.includes('relative'))
})

test('Tabs renders', () => {
  const html = wrap(
    h(
      Tabs,
      { defaultValue: 't1' },
      h(TabsList, null, h(TabsTrigger, { value: 't1' }, 'T1')),
      h(TabsContent, { value: 't1' }, 'C1')
    )
  )
  assert.ok(html.includes('C1'))
})

test('Textarea renders', () => {
  const html = wrap(h(Textarea))
  assert.ok(html.includes('textarea'))
})
