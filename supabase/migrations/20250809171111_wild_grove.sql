/*
  # Complete WAQTI Platform Database Schema

  1. New Tables
    - `service_requests` - Buyer-initiated project requests
    - `milestones` - Project milestone tracking
    - `referrals` - User referral system
    - `promotions` - Service promotion system
    - `reviews` - Enhanced review system
    - `notifications` - Real-time notifications
    - `activity_log` - User activity tracking
    - `payment_methods` - User payment methods
    - `disputes` - Dispute resolution system

  2. Security
    - Enable RLS on all new tables
    - Add comprehensive policies for data protection
    - Create secure functions for sensitive operations

  3. Features
    - Provider matching algorithm
    - Milestone-based payments
    - Referral reward system
    - Activity timeline
    - Enhanced search capabilities
*/

-- Service Requests Table (Buyer-initiated projects)
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  budget_amount integer NOT NULL CHECK (budget_amount > 0),
  budget_type text NOT NULL CHECK (budget_type IN ('time', 'money')),
  currency text DEFAULT 'AED',
  required_skills text[] DEFAULT '{}',
  deadline timestamptz,
  location text,
  is_remote boolean DEFAULT true,
  urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  attachments text[] DEFAULT '{}',
  proposals_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  sequence integer NOT NULL,
  title text NOT NULL,
  description text,
  amount integer NOT NULL CHECK (amount > 0),
  due_date timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected')),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES users(id),
  deliverables text[] DEFAULT '{}',
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referee_id uuid REFERENCES users(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reward_amount integer DEFAULT 50,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  promotion_type text NOT NULL CHECK (promotion_type IN ('basic', 'premium', 'ultimate')),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  credit_cost integer NOT NULL,
  view_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  order_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enhanced Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  would_recommend boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('message', 'booking', 'payment', 'review', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Activity Log Table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('credit_card', 'bank_account', 'digital_wallet')),
  provider text NOT NULL,
  last_four text NOT NULL,
  is_default boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  initiator_id uuid REFERENCES users(id) ON DELETE CASCADE,
  respondent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('payment', 'quality', 'delivery', 'communication')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title text NOT NULL,
  description text NOT NULL,
  resolution text,
  resolved_by uuid REFERENCES users(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table (Enhanced)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES users(id) ON DELETE CASCADE,
  package_index integer DEFAULT 0,
  total_amount integer NOT NULL CHECK (total_amount > 0),
  currency text DEFAULT 'AED',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'delivered', 'completed', 'cancelled')),
  details text,
  deadline timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Service Requests
CREATE POLICY "Users can view all open requests" ON service_requests
  FOR SELECT USING (status = 'open' OR client_id = auth.uid());

CREATE POLICY "Users can create requests" ON service_requests
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own requests" ON service_requests
  FOR UPDATE USING (auth.uid() = client_id);

-- RLS Policies for Milestones
CREATE POLICY "Milestone visibility" ON milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = order_id 
      AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
    )
  );

CREATE POLICY "Milestone updates" ON milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = order_id 
      AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
    )
  );

-- RLS Policies for Referrals
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "Users can create referrals" ON referrals
  FOR INSERT WITH CHECK (referrer_id = auth.uid());

-- RLS Policies for Reviews
CREATE POLICY "Reviews are publicly viewable" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (reviewer_id = auth.uid());

-- RLS Policies for Notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for Activity Log
CREATE POLICY "Users can view own activity" ON activity_log
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for Payment Methods
CREATE POLICY "Users can manage own payment methods" ON payment_methods
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for Disputes
CREATE POLICY "Dispute participants can view" ON disputes
  FOR SELECT USING (initiator_id = auth.uid() OR respondent_id = auth.uid());

CREATE POLICY "Users can create disputes" ON disputes
  FOR INSERT WITH CHECK (initiator_id = auth.uid());

-- RLS Policies for Orders
CREATE POLICY "Order participants can view" ON orders
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyers can create orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Order participants can update" ON orders
  FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Functions for Provider Matching
CREATE OR REPLACE FUNCTION match_providers_for_request(request_id uuid)
RETURNS TABLE (
  provider_id uuid,
  provider_name text,
  provider_rating numeric,
  match_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    (
      -- Skills match score (60%)
      (
        SELECT COUNT(*)::numeric 
        FROM unnest((SELECT required_skills FROM service_requests WHERE id = request_id)) AS req_skill
        WHERE req_skill = ANY(
          SELECT unnest(s.category || ARRAY[s.title]) 
          FROM services s 
          WHERE s.provider_id = u.id
        )
      ) / GREATEST(array_length((SELECT required_skills FROM service_requests WHERE id = request_id), 1), 1) * 0.6 +
      
      -- Rating score (30%)
      COALESCE(AVG(r.rating), 0) / 5 * 0.3 +
      
      -- Response time score (10%)
      CASE 
        WHEN u.created_at > NOW() - INTERVAL '30 days' THEN 0.1
        ELSE 0.05
      END
    ) as score
  FROM users u
  LEFT JOIN reviews r ON r.reviewee_id = u.id
  WHERE EXISTS (
    SELECT 1 FROM services s 
    WHERE s.provider_id = u.id 
    AND s.category = (SELECT category FROM service_requests WHERE id = request_id)
  )
  GROUP BY u.id, u.name, u.created_at
  ORDER BY score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION approve_milestone(
  milestone_id uuid,
  approver_id uuid
) RETURNS void AS $$
DECLARE
  milestone_amount integer;
  milestone_order_id uuid;
  order_record record;
BEGIN
  SELECT m.amount, m.order_id
  INTO milestone_amount, milestone_order_id
  FROM milestones m
  WHERE m.id = milestone_id;

  -- Get full order record
  SELECT *
  INTO order_record
  FROM orders o
  WHERE o.id = milestone_order_id;

  -- Update milestone status
  UPDATE milestones 
  SET 
    status = 'approved',
    approved_at = now(),
    approved_by = approver_id
  WHERE id = milestone_id;

  -- Transfer credits
  UPDATE users 
  SET balance = balance + milestone_amount
  WHERE id = order_record.seller_id;

  -- Log activity
  INSERT INTO activity_log (user_id, activity_type, title, description)
  VALUES (
    order_record.seller_id,
    'milestone_approved',
    'Milestone Approved',
    'Received ' || milestone_amount || ' credits for milestone completion'
  );

  -- Create notification
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (
    order_record.seller_id,
    'payment',
    'Milestone Payment Released',
    'You received ' || milestone_amount || ' credits for completing a milestone'
  );
END;
$$ LANGUAGE plpgsql;

-- Function for Referral Processing
CREATE OR REPLACE FUNCTION process_referral_signup(
  new_user_id uuid,
  referral_code text
) RETURNS void AS $$
DECLARE
  referrer_user_id uuid;
BEGIN
  -- Find referrer
  SELECT id INTO referrer_user_id
  FROM users 
  WHERE 'WAQTI-' || substring(id::text, 1, 8) = referral_code;

  IF referrer_user_id IS NOT NULL THEN
    -- Create referral record
    INSERT INTO referrals (referrer_id, referee_id, referral_code, status)
    VALUES (referrer_user_id, new_user_id, referral_code, 'completed');

    -- Award credits to referrer
    UPDATE users 
    SET balance = balance + 50
    WHERE id = referrer_user_id;

    -- Award welcome credits to new user
    UPDATE users 
    SET balance = balance + 25
    WHERE id = new_user_id;

    -- Log activities
    INSERT INTO activity_log (user_id, activity_type, title, description)
    VALUES 
      (referrer_user_id, 'referral_reward', 'Referral Bonus', 'Earned 50 credits for referring a friend'),
      (new_user_id, 'welcome_bonus', 'Welcome Bonus', 'Received 25 credits for joining through referral');

    -- Create notifications
    INSERT INTO notifications (user_id, type, title, message)
    VALUES 
      (referrer_user_id, 'system', 'Referral Reward', 'You earned 50 credits for referring a friend!'),
      (new_user_id, 'system', 'Welcome Bonus', 'You received 25 credits as a welcome bonus!');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function for Activity Timeline
CREATE OR REPLACE FUNCTION get_user_activity_timeline(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  activity_type text,
  title text,
  description text,
  created_at timestamptz,
  metadata jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    al.activity_type,
    al.title,
    al.description,
    al.created_at,
    al.metadata
  FROM activity_log al
  WHERE al.user_id = target_user_id
  ORDER BY al.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Function for Search Services
CREATE OR REPLACE FUNCTION search_services_advanced(
  search_term text DEFAULT '',
  category_filter text DEFAULT '',
  min_price integer DEFAULT 0,
  max_price integer DEFAULT 10000,
  location_filter text DEFAULT '',
  rating_filter numeric DEFAULT 0
) RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category text,
  hourly_rate integer,
  location text,
  rating numeric,
  reviews_count integer,
  provider_name text,
  provider_avatar text,
  image_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.description,
    s.category,
    s.hourly_rate,
    s.location,
    s.rating,
    s.reviews_count,
    u.name as provider_name,
    u.avatar_url as provider_avatar,
    s.image_url
  FROM services s
  JOIN users u ON s.provider_id = u.id
  WHERE 
    (search_term = '' OR 
     s.title ILIKE '%' || search_term || '%' OR 
     s.description ILIKE '%' || search_term || '%') AND
    (category_filter = '' OR s.category = category_filter) AND
    s.hourly_rate BETWEEN min_price AND max_price AND
    (location_filter = '' OR s.location ILIKE '%' || location_filter || '%') AND
    s.rating >= rating_filter
  ORDER BY 
    s.rating DESC,
    s.reviews_count DESC,
    s.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests(category);
CREATE INDEX IF NOT EXISTS idx_milestones_order_id ON milestones(order_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_date ON activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_service_rating ON reviews(service_id, rating);
CREATE INDEX IF NOT EXISTS idx_services_search ON services USING gin(to_tsvector('english', title || ' ' || description));

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE services 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE service_id = NEW.service_id
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE service_id = NEW.service_id
    )
  WHERE id = NEW.service_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_service_rating();

-- Function to log user activities
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (user_id, activity_type, title, description, metadata)
  VALUES (
    COALESCE(NEW.user_id, NEW.client_id, NEW.buyer_id, NEW.provider_id),
    TG_TABLE_NAME || '_' || TG_OP,
    CASE 
      WHEN TG_TABLE_NAME = 'services' AND TG_OP = 'INSERT' THEN 'Service Created'
      WHEN TG_TABLE_NAME = 'orders' AND TG_OP = 'INSERT' THEN 'Order Placed'
      WHEN TG_TABLE_NAME = 'reviews' AND TG_OP = 'INSERT' THEN 'Review Posted'
      ELSE 'Activity Logged'
    END,
    CASE 
      WHEN TG_TABLE_NAME = 'services' THEN 'Created service: ' || NEW.title
      WHEN TG_TABLE_NAME = 'orders' THEN 'Placed order for service'
      WHEN TG_TABLE_NAME = 'reviews' THEN 'Posted review with ' || NEW.rating || ' stars'
      ELSE 'User activity'
    END,
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging triggers
CREATE TRIGGER log_service_activity
  AFTER INSERT OR UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION log_user_activity();

CREATE TRIGGER log_order_activity
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_user_activity();

CREATE TRIGGER log_review_activity
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION log_user_activity();
