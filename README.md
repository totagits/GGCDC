# GGCDC Community Development Platform

Source for the private GGCDC Site at https://ggcdc.mgwoah.chatgpt.site.

This first release contains a council dashboard and 14 connected work areas for Putu mining and development: agreements, land rights, employment, workforce, procurement, suppliers, skills, environment, infrastructure, benefits, grievances, transparency, monitoring, and governance. Records use Cloudflare D1 and may be linked across areas, searched, updated, and exported. The workforce registry records consent before saving a profile.

## Run locally

Requires Node.js 22 or later. Install dependencies with `pnpm install`, then run `pnpm dev`. The app expects the Sites platform's private access and D1 `DB` binding; its deployment configuration is in `.openai/hosting.json`.

Run `pnpm db:generate` after changing `db/schema.ts`, and `pnpm build` to compile the Worker. Production migrations are in `drizzle/`.

## Status and access

The Site is private to its owner. This repository is a source backup; pushing here does not automatically deploy the Site. The current release does not yet include council role provisioning, document uploads, approval workflows, or full specialized module operations. Do not enter real workforce contact data before those controls are designed and reviewed.
