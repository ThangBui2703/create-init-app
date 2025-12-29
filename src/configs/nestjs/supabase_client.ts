import path from "path";
import fs from "fs-extra";

export async function configSupabaseClient(projectName: string) {
    const supabaseDir = path.join(projectName, "src", "supabase");
    await fs.ensureDir(supabaseDir);

    const supabaseModulePath = path.join(supabaseDir, "supabase.module.ts");
    await fs.ensureFile(supabaseModulePath);

    await fs.writeFile(supabaseModulePath, supabaseModuleTemplate);
}

const supabaseModuleTemplate = `import { Module, Scope } from '@nestjs/common';
import {  ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';

export const SUPABASE_CLIENT=Symbol("supabase-client")
export const SUPABASE_ADMIN=Symbol("supabase-admin")
@Module({
   providers: [
    {
        provide: SUPABASE_CLIENT,
        inject: [ConfigService,REQUEST],
        scope: Scope.REQUEST,
        useFactory: (configService: ConfigService, request: Request) => {
            const supabaseUrl = configService.get<string>("SUPABASE_URL");
            const supabaseAnonKey = configService.get<string>("SUPABASE_ANON_KEY");
            if(!supabaseUrl || !supabaseAnonKey) {
                throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set in the environment variables");
            }
            return createClient(supabaseUrl, supabaseAnonKey,{global:{headers:{
                Authorization: request.headers.authorization as string,
            }}});
        },
    },
    {
        provide: SUPABASE_ADMIN,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const supabaseUrl = configService.get<string>("SUPABASE_URL");
            const supabaseServiceRoleKey = configService.get<string>("SUPABASE_SERVICE_ROLE_KEY");
            if(!supabaseUrl || !supabaseServiceRoleKey) {
                throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in the environment variables");
            }
            return createClient(supabaseUrl, supabaseServiceRoleKey);
        },
    },
   ],
   exports:[SUPABASE_CLIENT, SUPABASE_ADMIN]
})
export class SupabaseModule {}
`;