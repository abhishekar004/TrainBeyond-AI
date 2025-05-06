
export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  body_part: string;
  equipment: string | null;
  difficulty_level: string;
  image_url: string | null;
  created_at?: string;
}
