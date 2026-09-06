/**
 * Global DOM Safety Guard for Next.js & React
 * 
 * Intercepts Node.prototype.insertBefore and Node.prototype.removeChild
 * to gracefully handle DOM mutations caused by browser extensions
 * (Google Translate, Grammarly, Password Managers, AdBlockers, autofill)
 * 
 * Prevents:
 * - "Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
 * - "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
 */

export function installDomGuard() {
  if (typeof window === 'undefined' || typeof Node === 'undefined') return;

  const w = window as any;
  if (w.__DOM_GUARD_INSTALLED__) return;
  w.__DOM_GUARD_INSTALLED__ = true;

  // 1. Safe insertBefore
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newChild: T, refChild: Node | null): T {
    if (refChild && refChild.parentNode !== this) {
      if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined' && console.warn) {
        console.warn('[DOM Safe Guard] Handled mismatched insertBefore reference node:', refChild);
      }
      if (refChild.parentNode) {
        return refChild.parentNode.insertBefore(newChild, refChild);
      }
      return this.appendChild(newChild);
    }
    return originalInsertBefore.call(this, newChild, refChild) as T;
  };

  // 2. Safe removeChild
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined' && console.warn) {
        console.warn('[DOM Safe Guard] Handled mismatched removeChild target node:', child);
      }
      if (child.parentNode) {
        return child.parentNode.removeChild(child);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };
}

if (typeof window !== 'undefined') {
  installDomGuard();
}
