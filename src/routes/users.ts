import { Router } from "express";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { user } from "../db/schema/index.js";
import { db } from "../db/index.js";
import type { UserRoles } from "../type.js";


const usersRouter = Router();


usersRouter.get( '/' , async ( req , res ) => {
  try {
    const { search, role, page=1, limit=10 } = req.query;

    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = []

    if (search) {
      const escapedSearch = String(search).replace(/[%_]/g, '\\$&');
      filterConditions.push(
        or(
          ilike(user.name, `%${escapedSearch}%`),
          ilike(user.email, `%${escapedSearch}%`),
        )
      )
    }

    const validRoles: UserRoles[] = ['admin', 'teacher', 'student'];
    
    if (role) {
      if (!validRoles.includes(role as UserRoles)) {
        return res.status(400).json({ error: 'Invalid role parameter' });
      }
      filterConditions.push(eq(user.role, role as UserRoles));
    }

    const whereClause = filterConditions.length > 0
      ? and(...filterConditions)
      : undefined;
    
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(whereClause);
    
    const totalCount = countResult[0]?.count ?? 0;

    const usersList = await db
      .select(getTableColumns(user))
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage)
      }
    })

  }
  catch (e) {
    console.error(`GET /users error: ${e}`);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
})


export default usersRouter;